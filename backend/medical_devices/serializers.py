from rest_framework import serializers
from .models import EudamedData, FdaData

class EudamedSerializer(serializers.ModelSerializer):

    class Meta:
        model = EudamedData
        fields = ('basic_udi', 'primary_di', 'uuid', 'ulid', 'basic_udi_di_data_ulid', 'risk_class', 'device_name',
                  'manufacturer_name', 'manufacturer_srn', 'device_status_type', 'manufacturer_status',
                  'latest_version', 'version_number', 'reference', 'basic_udi_data_version_number',
                  'container_package_count', 'authorised_representative_srn', 'authorised_representative_name')


class FdaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FdaData
        fields = ('k_number', 'manufacturer_name', 'contact', 'address1', 'address2', 'city', 'state', 'country_code',
                  'zip_code', 'postal_code', 'date_received', 'decision_date', 'decision_description', 'product_code',
                  'statement_or_summary', 'clearance_type', 'third_party_flag', 'expedited_review_flag', 'device_name',
                  'url', 'device_description', 'medical_specialty_description', 'device_class', 'regulation_number',
                  'submission_type_id')