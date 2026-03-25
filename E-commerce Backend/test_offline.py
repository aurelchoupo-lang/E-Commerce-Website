import os
import django
from django.conf import settings
from django.test.utils import get_runner

def start_tests():
    os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'
    django.setup()
    
    TestRunner = get_runner(settings)
    
    class PercentageTestRunner(TestRunner):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.total_tests = 0

        def run_suite(self, suite, **kwargs):
            self.total_tests = suite.countTestCases()
            return super().run_suite(suite, **kwargs)

        def suite_result(self, suite, result, **kwargs):
            # Standard Django suite result behavior
            res = super().suite_result(suite, result, **kwargs)
            
            # Calculate percentages
            tests_run = result.testsRun
            failed = len(result.failures) + len(result.errors)
            passed = tests_run - failed
            
            print("\n========================================")
            print("         OFFLINE TEST RESULTS           ")
            print("========================================")
            print(f"Total Tests Found : {self.total_tests}")
            print(f"Tests Run         : {tests_run}")
            print(f"Tests Passed      : {passed}")
            print(f"Tests Failed      : {failed}")
            
            if tests_run > 0:
                percent = (passed / tests_run) * 100
                print(f"Pass Percentage   : {percent:.2f}%")     
                if percent == 100:
                    print("\n🌟 PERFECT SCORE! All systems are GO. 🌟")
            else:
                print("Pass Percentage   : 0.00%")
            print("========================================")
            return res

    # Run tests specifically in the 'products' app where our endpoints are
    test_runner = PercentageTestRunner(verbosity=1)
    print("\nStarting Offline Test Suite...")
    print("This will test API endpoints without modifying your actual database.")
    failures = test_runner.run_tests(["products"])

if __name__ == "__main__":
    start_tests()
