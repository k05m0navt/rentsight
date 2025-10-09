# Data Model: Build a web application for renter to help to see analytics about his rents.

**Feature Branch**: `001-build-a-web`  
**Date**: 2025-10-09

## Entities

### User
- `id`: Primary key (UUID)
- `email`: User's email address (unique)
- `password_hash`: Hashed password for authentication
- `created_at`: Timestamp of user creation
- `updated_at`: Timestamp of last update

### RentEntry
- `id`: Primary key (UUID)
- `user_id`: Foreign key referencing User.id
- `amount`: Rent income for the period (decimal)
- `booked_days`: Number of days booked for this rent (integer)
- `platform`: Name of the platform where the rent was published (string)
- `start_date`: Start date of the rental period (date)
- `end_date`: End date of the rental period (date)
- `created_at`: Timestamp of entry creation
- `updated_at`: Timestamp of last update

### ExpenseEntry
- `id`: Primary key (UUID)
- `user_id`: Foreign key referencing User.id
- `amount`: Expense amount (decimal)
- `category`: Category of the expense (string, e.g., "Maintenance", "Utilities")
- `description`: Optional description of the expense (text)
- `date`: Date of the expense (date)
- `created_at`: Timestamp of entry creation
- `updated_at`: Timestamp of last update

### Tag
- `id`: Primary key (UUID)
- `user_id`: Foreign key referencing User.id
- `name`: Name of the tag (unique per user)
- `created_at`: Timestamp of tag creation

### RentEntryTag (Junction Table for Many-to-Many relationship between RentEntry and Tag)
- `rent_entry_id`: Foreign key referencing RentEntry.id
- `tag_id`: Foreign key referencing Tag.id
- Composite primary key: (`rent_entry_id`, `tag_id`)

### ExpenseEntryTag (Junction Table for Many-to-Many relationship between ExpenseEntry and Tag)
- `expense_entry_id`: Foreign key referencing ExpenseEntry.id
- `tag_id`: Foreign key referencing Tag.id
- Composite primary key: (`expense_entry_id`, `tag_id`)

## Relationships

- One User has many RentEntries (one-to-many)
- One User has many ExpenseEntries (one-to-many)
- One User has many Tags (one-to-many)
- One RentEntry can have many Tags, and one Tag can be applied to many RentEntries (many-to-many via RentEntryTag)
- One ExpenseEntry can have many Tags, and one Tag can be applied to many ExpenseEntries (many-to-many via ExpenseEntryTag)

## Validation Rules

- All `amount` fields (rent and expense) MUST be positive.
- `booked_days` MUST be a positive integer.
- `platform` and `category` fields MUST be non-empty strings.
- `start_date` MUST be before or equal to `end_date` for `RentEntry`.
- `email` MUST be a valid email format and unique.
- `password` MUST meet minimum complexity requirements (e.g., length, characters - handled by Supabase Auth).
- Tag `name` MUST be unique per user and non-empty.
