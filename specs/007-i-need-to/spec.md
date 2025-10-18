# Feature Specification: Enhanced Platform Support with Russian Markets

**Feature Branch**: `007-i-need-to`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "I need to have Avito, Cian, Sutochno.ru and other Russian platforms inside the app, if the user want to add new custom platform, he can do it. Right now there are only 4 options for the user and the last option Other is bad, because user can not type which platform"

## Clarifications

### Session 2025-01-27

- Q: When a user deletes a custom platform that has existing rent entries, what should happen to those entries? → A: C (Prevent deletion and show warning about existing entries)
- Q: Should custom platform names be available to all users or only to the user who created them? → A: A (Custom platforms are private to each user)
- Q: How should Russian platforms be integrated with the current hardcoded platform options? → A: A (Replace current 4 options entirely with Russian platforms)
- Q: When a user enters an invalid custom platform name, how should the system respond? → A: D (Show error message but keep the input for user to fix)
- Q: Where should users access the platform management interface? → A: B (Modal/popup accessible from rent entry form)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Russian Platform Selection (Priority: P1)

Russian property managers can select from popular Russian rental platforms (Avito, Cian, Sutochno.ru) when creating rent entries, enabling accurate tracking of income from Russian market sources.

**Why this priority**: This directly addresses the user's primary need for Russian platform support and provides immediate value for Russian users who are currently limited to generic "Other" option.

**Independent Test**: Can be fully tested by creating a rent entry and verifying that Russian platforms appear in the platform dropdown and can be selected successfully.

**Acceptance Scenarios**:

1. **Given** a user is creating a rent entry, **When** they open the platform dropdown, **Then** they see Avito, Cian, Sutochno.ru, and other Russian platforms as options
2. **Given** a user selects a Russian platform, **When** they submit the rent entry, **Then** the platform is saved correctly and appears in reports

---

### User Story 2 - Custom Platform Entry (Priority: P2)

Users can add custom platform names when the "Other" option is selected, allowing them to specify exactly which platform they used for their rental income.

**Why this priority**: This solves the current limitation where "Other" doesn't allow users to specify the actual platform name, making data less useful for analysis and reporting.

**Independent Test**: Can be fully tested by selecting "Other" platform option and verifying that a text input appears allowing custom platform name entry.

**Acceptance Scenarios**:

1. **Given** a user selects "Other" as platform, **When** the form updates, **Then** a text input field appears for entering custom platform name
2. **Given** a user enters a custom platform name, **When** they submit the form, **Then** the custom platform name is saved and displayed in reports
3. **Given** a user has previously entered a custom platform, **When** they create a new entry, **Then** the custom platform appears as a selectable option in the dropdown

---

### User Story 3 - Platform Management (Priority: P3)

Users can manage their custom platforms through a dedicated interface, allowing them to edit, delete, or organize their frequently used platforms.

**Why this priority**: This provides advanced functionality for power users who work with many different platforms and need better organization of their platform data.

**Independent Test**: Can be fully tested by accessing platform management interface and performing CRUD operations on custom platforms.

**Acceptance Scenarios**:

1. **Given** a user has created custom platforms, **When** they access platform management, **Then** they see a list of all their custom platforms
2. **Given** a user wants to edit a platform name, **When** they click edit, **Then** they can modify the platform name and save changes
3. **Given** a user wants to remove a platform, **When** they delete it, **Then** the platform is removed and no longer appears in dropdowns

---

### Edge Cases

- What happens when a user enters a very long custom platform name (over 100 characters)? → Show error message but keep input for correction
- How does the system handle duplicate custom platform names? → Prevent duplicates for the same user
- What happens when a user tries to delete a platform that has existing rent entries associated with it? → Prevent deletion and show warning about existing entries
- How does the system handle special characters in custom platform names? → Support international characters and special symbols
- What happens when a user enters an invalid platform name (too short, empty, etc.)? → Show error message but keep input for user to fix

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST replace current 4 platform options entirely with at least 8 Russian platforms (Avito, Cian, Sutochno.ru, Domclick, Yandex.Realty, and 3 additional major Russian rental platforms)
- **FR-002**: System MUST allow users to select "Other" and enter a custom platform name in a text input field, then save it as user-specific (private to each user) and make it available for future rent entries
- **FR-003**: System MUST display custom platform names in reports and analytics
- **FR-004**: System MUST provide a platform management interface accessible via modal from the rent entry form
- **FR-005**: System MUST validate custom platform names (minimum 2 characters, maximum 100 characters) and show error messages while keeping invalid input for user correction
- **FR-006**: System MUST prevent duplicate custom platform names for the same user
- **FR-007**: System MUST prevent deletion of custom platforms that have associated rent entries and show warning about existing entries
- **FR-008**: System MUST support platform names with international characters and special symbols
- **FR-009**: System MUST maintain backward compatibility with existing rent entries using "Other" platform
- **FR-010**: System MUST cache platform lists for 5 minutes to optimize performance
- **FR-011**: System MUST invalidate platform cache immediately when custom platforms are modified

### Key Entities *(include if feature involves data)*

- **Platform**: Represents a rental platform with id, name, url, region, and user association
- **CustomPlatform**: User-created platform entries with name, creation date, usage count, and user_id (private to each user)
- **RentEntry**: Existing entity that references platform information for income tracking

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select from at least 8 Russian platforms (Avito, Cian, Sutochno.ru, Domclick, Yandex.Realty, and 3 others) within 2 seconds
- **SC-002**: 95% of users can successfully create a rent entry with a custom platform name in under 30 seconds
- **SC-003**: Custom platform names are accurately displayed in 100% of reports and analytics views
- **SC-004**: Platform management operations (create, edit, delete) complete successfully for 99% of user actions
- **SC-005**: System maintains data integrity with zero data loss when managing custom platforms