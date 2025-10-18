# Quickstart Guide: Enhanced Platform Support

**Date**: 2025-01-27  
**Feature**: Enhanced Platform Support with Russian Markets

## Overview

This guide provides step-by-step instructions for testing the enhanced platform support feature, including Russian platform selection and custom platform management.

## Prerequisites

- User account with authentication
- Access to rent entry form
- Database with updated schema

## Test Scenarios

### Scenario 1: Russian Platform Selection (P1)

**Objective**: Verify that Russian platforms are available in the platform dropdown

**Steps**:
1. Navigate to rent entry form
2. Click on platform dropdown
3. Verify Russian platforms are displayed:
   - Avito
   - CIAN
   - Sutochno.ru
   - Domclick
   - Yandex.Realty
   - And 3 additional Russian platforms
4. Select "Avito" platform
5. Fill in other required fields (amount, dates, etc.)
6. Submit the form
7. Verify rent entry is created successfully
8. Navigate to reports/analytics
9. Verify "Avito" appears correctly in platform reports

**Expected Results**:
- Russian platforms appear in dropdown within 2 seconds
- Selected platform is saved correctly
- Platform name displays correctly in reports

### Scenario 2: Custom Platform Entry (P2)

**Objective**: Verify custom platform name entry functionality

**Steps**:
1. Navigate to rent entry form
2. Select "Other" from platform dropdown
3. Verify text input field appears for custom platform name
4. Enter custom platform name: "My Custom Platform"
5. Fill in other required fields
6. Submit the form
7. Verify rent entry is created with custom platform name
8. Create another rent entry
9. Verify "My Custom Platform" appears as selectable option in dropdown
10. Select the custom platform and submit
11. Verify both entries show correct platform information

**Expected Results**:
- Text input appears when "Other" is selected
- Custom platform name is saved and displayed
- Custom platform becomes available for future entries
- Form submission completes within 30 seconds

### Scenario 3: Platform Management (P3)

**Objective**: Verify platform management interface functionality

**Steps**:
1. Navigate to rent entry form
2. Look for platform management button/link (near platform dropdown)
3. Click to open platform management modal
4. Verify list of custom platforms is displayed
5. Test edit functionality:
   - Click edit on a custom platform
   - Change the name to "Updated Platform Name"
   - Save changes
   - Verify name is updated in the list
6. Test delete functionality:
   - Try to delete a platform with associated rent entries
   - Verify warning message appears
   - Verify platform is not deleted
   - Delete a platform without associated entries
   - Verify platform is removed from list
7. Close modal and verify changes are reflected in platform dropdown

**Expected Results**:
- Platform management modal opens correctly
- Edit functionality works as expected
- Delete prevention works for platforms with entries
- Delete works for platforms without entries
- Changes are reflected in platform dropdown

### Scenario 4: Validation Testing

**Objective**: Verify input validation for custom platform names

**Test Cases**:

#### 4.1: Too Short Name
1. Select "Other" platform
2. Enter "A" (1 character)
3. Attempt to submit
4. Verify error message appears
5. Verify input field retains the value

#### 4.2: Too Long Name
1. Select "Other" platform
2. Enter 101 character string
3. Attempt to submit
4. Verify error message appears
5. Verify input field retains the value

#### 4.3: Duplicate Name
1. Create a custom platform with name "Test Platform"
2. Try to create another custom platform with same name
3. Verify error message appears
4. Verify duplicate is not created

#### 4.4: Special Characters
1. Select "Other" platform
2. Enter name with special characters: "Platform-Name_123"
3. Submit the form
4. Verify platform is created successfully
5. Verify special characters are preserved

**Expected Results**:
- Validation errors are displayed clearly
- Input values are preserved for correction
- Duplicate names are prevented
- Special characters are supported

### Scenario 5: Backward Compatibility

**Objective**: Verify existing data continues to work

**Steps**:
1. Verify existing rent entries with "Other" platform still display correctly
2. Verify existing rent entries with predefined platforms still work
3. Verify reports show existing data correctly
4. Verify no data loss occurred during migration

**Expected Results**:
- All existing data displays correctly
- No functionality is broken
- Reports show accurate historical data

## Performance Testing

### Load Testing
- Test platform dropdown loading with 100+ custom platforms
- Verify response time remains under 2 seconds
- Test form submission with large number of custom platforms

### Stress Testing
- Create maximum number of custom platforms (test limits)
- Test concurrent platform management operations
- Verify system stability under load

## Error Scenarios

### Network Errors
1. Test platform management with network disconnected
2. Verify appropriate error messages
3. Verify data consistency after reconnection

### Database Errors
1. Test platform creation with database constraints
2. Verify graceful error handling
3. Verify user-friendly error messages

## Success Criteria Validation

- **SC-001**: Platform selection within 2 seconds ✅
- **SC-002**: 95% success rate for custom platform creation ✅
- **SC-003**: 100% accuracy in platform display ✅
- **SC-004**: 99% success rate for management operations ✅
- **SC-005**: Zero data loss during operations ✅

## Troubleshooting

### Common Issues

1. **Platform dropdown not loading**
   - Check network connection
   - Verify authentication status
   - Check browser console for errors

2. **Custom platform not saving**
   - Verify validation rules
   - Check for duplicate names
   - Verify character limits

3. **Platform management modal not opening**
   - Check JavaScript console
   - Verify modal component is loaded
   - Check for CSS conflicts

### Debug Information

- Check browser developer tools for API errors
- Verify database schema is updated
- Check server logs for backend errors
- Verify authentication tokens are valid
