from django.test import TestCase
from .models import FdaData, EudamedData


class SearchFunctionalityTests(TestCase):

    def setUp(self):
        """
        Set up initial test data.
        """
        FdaData.objects.create(device_name="TestDevice1", manufacturer_name="ManufacturerA", k_number="999999")
        FdaData.objects.create(device_name="TestDevice1", manufacturer_name="Manufacturer.A", k_number="989898")
        EudamedData.objects.create(device_name="TestDevice1", manufacturer_name="ManufacturerA", primary_di="888888")
        EudamedData.objects.create(device_name="TestDevice1", manufacturer_name="Manufacturer__A", primary_di="878787")
        FdaData.objects.create(device_name="TestDevice2", manufacturer_name="ManufacturerB", k_number="777777")
        EudamedData.objects.create(device_name="TestDevice3", manufacturer_name="ManufacturerA", primary_di="666666")

    def test_device_in_both_tables_individually(self):
        """
        Test that the device found in both tables returns correct data.
        """
        # Perform the search operation
        responseFda = self.client.get('/get_fda_data/', {'device_name': 'TestDevice1'})

        self.assertEqual(responseFda.status_code, 200)
        self.assertIn('ManufacturerA', responseFda.content.decode())

        responseEudamed = self.client.get('/get_eudamed_data/', {'device_name': 'TestDevice1'})
        self.assertEqual(responseEudamed.status_code, 200)
        self.assertIn('ManufacturerA', responseEudamed.content.decode())

    def test_device_in_fda_only(self):
        """
        Test that a device found only in the FDA table returns correct data.
        """
        responseFda = self.client.get('/get_fda_data/', {'device_name': 'TestDevice2'})
        self.assertEqual(responseFda.status_code, 200)
        self.assertIn('ManufacturerB', responseFda.content.decode())

        responseEudamed = self.client.get('/get_eudamed_data/', {'device_name': 'TestDevice2'})
        self.assertEqual(responseEudamed.status_code, 200)
        self.assertEqual(responseEudamed.json(), [])

    def test_device_in_eudamed_only(self):
        """
        Test that a device found only in the FDA table returns correct data.
        """
        responseEudamed = self.client.get('/get_eudamed_data/', {'device_name': 'TestDevice3'})
        self.assertEqual(responseEudamed.status_code, 200)
        self.assertIn('ManufacturerA', responseEudamed.content.decode())

        responseFda = self.client.get('/get_fda_data/', {'device_name': 'TestDevice3'})
        self.assertEqual(responseFda.status_code, 200)
        self.assertEqual(responseFda.json(), [])

    def test_device_not_found(self):
        """
        Test that searching for a non-existing device returns a not found message.
        """
        responseEudamed = self.client.get('/get_eudamed_data/', {'device_name': 'NonExistentDevice'})
        responseFda = self.client.get('/get_fda_data/', {'device_name': 'NonExistentDevice'})

        self.assertEqual(responseEudamed.status_code, 200)
        self.assertEqual(responseFda.status_code, 200)
        self.assertEqual(responseEudamed.json(), [])
        self.assertEqual(responseFda.json(), [])

    def test_device_in_both_tables(self):
        response = self.client.get('/get_device_info/', {'device_name': 'TestDevice1'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('ManufacturerA', response.content.decode())
        self.assertEqual(response.json()[0]['manufacturer_name'], "ManufacturerA")
        self.assertEqual(response.json()[0]['k_number'], "999999")
        self.assertEqual(response.json()[0]['primary_di'], "888888")
