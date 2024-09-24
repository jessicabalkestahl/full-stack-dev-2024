import re
import string

from django.http import JsonResponse
from django.db.models import Max

from rest_framework.decorators import api_view

from .models import EudamedData, FdaData
from .serializers import EudamedSerializer, FdaSerializer

@api_view(['GET'])
def get_eudamed_data(request):
    """
    Retrieve Eudamed data based on the provided device name.
    :param request: Request object containing the device name.
    :return: JSON response with serialized Eudamed data.
    """

    data = EudamedData.objects.filter(device_name__iexact=request.GET.get('device_name'))

    serializer = EudamedSerializer(data, context={'request': request}, many=True)

    return JsonResponse(serializer.data, safe=[])


@api_view(['GET'])
def get_fda_data(request):
    """
    Retrieve Fda data based on the provided device name.
    :param request: Request object containing the device name.
    :return: JSON response with serialized Fda data.
    """

    data = FdaData.objects.filter(device_name__iexact=request.GET.get('device_name'))

    serializer = FdaSerializer(data, context={'request': request}, many=True)

    return JsonResponse(serializer.data, safe=[])


@api_view(['GET'])
def get_device_info(request):
    """
    Retrieve device information from FDA and Eudamed databases based on the provided device name.
    Filter and merge the data to return a JSON response with matched and unmatched manufacturer details.
    """

    # Query FDA data for the given device name, grouping by manufacturer and getting the highest k_number
    highest_k_number = (FdaData.objects.filter(device_name__iexact=request.GET.get('device_name')).
                values('manufacturer_name').annotate(max_k_number=Max('k_number')).values('max_k_number'))
    # Retrieve detailed FDA data based on the filtered k_numbers
    fda_result = FdaData.objects.filter(device_name__iexact=request.GET.get('device_name'), k_number__in=highest_k_number)
    fda_serializer = FdaSerializer(fda_result, context={'request': request}, many=True)

    # Query Eudamed data for the given device name, grouping by manufacturer and getting the highest primary_di
    highest_primary_di = (EudamedData.objects.filter(device_name__iexact=request.GET.get('device_name')).
                                      values('manufacturer_name').annotate(max_primary_di=Max('primary_di')).values(
        'max_primary_di'))
    # Retrieve detailed Eudamed data based on the filtered primary_di
    eudamed_result = EudamedData.objects.filter(device_name__iexact=request.GET.get('device_name'), primary_di__in=highest_primary_di)
    eudamed_serializer = EudamedSerializer(eudamed_result, context={'request': request}, many=True)

    # Filter manufacturers to remove duplicates from the serialized FDA and Eudamed data
    fda_data = filter_manufacturers(fda_serializer.data, "k_number")
    eudamed_data = filter_manufacturers(eudamed_serializer.data, "primary_di")

    
    merged_data = merge_data_from_both_tables(fda_data, eudamed_data)

    return JsonResponse(merged_data, safe=[])


def merge_data_from_both_tables(fda_data, eudamed_data):
    """
    Merge data from FDA and Eudamed tables based on manufacturer name.
    This matching process ignores capitalization and punctuation.
    Returns a list of merged data items along with non-matching items from both tables.
    """
    merged_data = []
    non_matching_fda = []
    non_matching_eudamed = eudamed_data.copy()

    # Match FDA and Eudamed data based on manufacturer name. This match doesn't take into consideration capitalization and punctuation.
    for fda_item in fda_data:
        match_found = False
        for eudamed_item in eudamed_data:
            if re.sub(r'[^\w\s]', '', fda_item['manufacturer_name']).lower() == re.sub(r'[^\w\s]', '', eudamed_item['manufacturer_name']).lower():

                # Merge matching items and add to merged_data
                merged_dict = {**fda_item, **eudamed_item}
                merged_data.append(merged_dict)
                match_found = True
                
                # Remove matched item from non_matching_eudamed
                non_matching_eudamed.remove(eudamed_item)
                break
        if not match_found:
            # Add non-matching FDA items to non_matching_fda
            non_matching_fda.append(fda_item)
    # Add non-matching FDA and Eudamed items to merged_data
    merged_data.extend(non_matching_fda)
    merged_data.extend(non_matching_eudamed)

    return merged_data


def filter_manufacturers(data, primary_key_name):
    """
    Filter and return a list of unique objects based on a specific primary key within the input data.
    Args:
        data (list): A list of dictionaries containing objects to filter.
        primary_key_name (str): The name of the primary key to determine uniqueness.
    Returns:
        list: A list of unique objects based on the specified primary key.
    """
    unique_objects = {}

    for obj in data:

        normalized_name = obj['manufacturer_name'].lower().translate(str.maketrans('', '', string.punctuation))

        # Check if this manufacturer_name is already in the dictionary
        if normalized_name in unique_objects:
            # Update if the current primary key is higher
            if obj[primary_key_name] > unique_objects[normalized_name][primary_key_name]:
                unique_objects[normalized_name] = obj
        else:
            unique_objects[normalized_name] = obj

    return list(unique_objects.values())
