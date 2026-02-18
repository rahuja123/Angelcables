#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class AngelCablesAPITester:
    def __init__(self, base_url="https://angel-cables-revamp.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            
            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text}
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                self.results.append({
                    "test": name,
                    "status": "PASS",
                    "expected_code": expected_status,
                    "actual_code": response.status_code,
                    "response_preview": str(response_data)[:100] + "..." if len(str(response_data)) > 100 else response_data
                })
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response_data}")
                self.results.append({
                    "test": name,
                    "status": "FAIL", 
                    "expected_code": expected_status,
                    "actual_code": response.status_code,
                    "error": response_data
                })
            
            return success, response_data

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                "test": name,
                "status": "ERROR",
                "error": str(e)
            })
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_get_all_products(self):
        """Test getting all products"""
        success, data = self.run_test("Get All Products", "GET", "products", 200)
        if success:
            if isinstance(data, list):
                print(f"   Found {len(data)} products")
                # Check if we have the expected 12 products
                if len(data) == 12:
                    print("   ✅ Correct number of products (12)")
                else:
                    print(f"   ⚠️ Expected 12 products, got {len(data)}")
            else:
                print(f"   ❌ Expected list, got {type(data)}")
        return success, data

    def test_get_categories(self):
        """Test getting product categories"""
        success, data = self.run_test("Get Categories", "GET", "products/categories", 200)
        if success:
            if isinstance(data, list):
                print(f"   Found categories: {data}")
                # Check if we have the expected 6 categories
                expected_categories = ["Armoured Cable", "Flexible Cable", "Electric House Wire", 
                                     "CCTV Cables", "Copper Wire", "Submersible Cable"]
                if len(data) == 6:
                    print("   ✅ Correct number of categories (6)")
                else:
                    print(f"   ⚠️ Expected 6 categories, got {len(data)}")
            else:
                print(f"   ❌ Expected list, got {type(data)}")
        return success, data

    def test_filter_by_category(self):
        """Test filtering products by category"""
        success, data = self.run_test(
            "Filter by Category (Armoured Cable)", 
            "GET", 
            "products", 
            200,
            params={"category": "Armoured Cable"}
        )
        if success:
            if isinstance(data, list):
                armoured_count = len(data)
                print(f"   Found {armoured_count} armoured cable products")
                # Verify all returned products are actually armoured cables
                all_armoured = all(p.get('category') == 'Armoured Cable' for p in data)
                if all_armoured:
                    print("   ✅ All returned products are armoured cables")
                else:
                    print("   ❌ Some products don't match the filter")
            else:
                print(f"   ❌ Expected list, got {type(data)}")
        return success, data

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_form = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@angelcables.com", 
            "phone": "+91 9876543210",
            "subject": "Test Enquiry",
            "message": "This is a test message from the API testing suite."
        }
        
        success, data = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact", 
            200,
            data=test_form
        )
        
        if success:
            if isinstance(data, dict) and data.get('success'):
                print("   ✅ Contact form submitted successfully")
            else:
                print(f"   ⚠️ Unexpected response format: {data}")
        
        return success, data

    def test_get_company_info(self):
        """Test getting company information"""
        success, data = self.run_test("Get Company Info", "GET", "company", 200)
        if success:
            if isinstance(data, dict):
                required_fields = ["name", "parent_company", "phone", "email", "address"]
                missing_fields = [field for field in required_fields if field not in data]
                if not missing_fields:
                    print("   ✅ All required company fields present")
                    print(f"   Company: {data.get('name')} - {data.get('parent_company')}")
                else:
                    print(f"   ⚠️ Missing fields: {missing_fields}")
            else:
                print(f"   ❌ Expected dict, got {type(data)}")
        return success, data

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Angel Cables API Testing...")
        print(f"📡 Base URL: {self.base_url}")
        print("=" * 50)
        
        # Run all test methods
        self.test_api_root()
        self.test_get_all_products()
        self.test_get_categories() 
        self.test_filter_by_category()
        self.test_contact_form_submission()
        self.test_get_company_info()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = AngelCablesAPITester()
    success = tester.run_all_tests()
    
    # Write detailed results for debugging
    with open('/tmp/api_test_results.json', 'w') as f:
        json.dump(tester.results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())