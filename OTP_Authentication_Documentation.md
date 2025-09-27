# OTP-Only Authentication System

This document describes the implementation of the simplified OTP-only authentication system for the appointment booking application.

## Overview

The authentication system has been simplified to use only phone number and OTP verification for both login and signup. Users no longer need to create accounts with passwords or provide email addresses upfront.

## How It Works

### For New Users
1. User enters their phone number
2. System sends OTP to the phone number
3. User verifies OTP
4. System automatically creates a user account with:
   - Phone number (verified)
   - Default name (User XXXX where XXXX is last 4 digits of phone)
   - Temporary email (phonenumber@tempuser.com)
   - Default empty address
   - Generated placeholder password

### For Existing Users
1. User enters their phone number
2. System sends OTP to the phone number
3. User verifies OTP
4. System logs them in immediately

## Backend Changes

### API Endpoints Modified

1. **`POST /api/auth/send-otp`**
   - No longer checks if user exists
   - Always sends OTP to any valid phone number

2. **`POST /api/auth/verify-otp`**
   - Verifies OTP
   - If user exists: logs them in
   - If user doesn't exist: creates new account automatically and logs them in

3. **`POST /api/auth/check-phone`** 
   - Now deprecated but kept for backward compatibility
   - Always returns `exists: false` to force OTP flow

### Database Changes

1. **users table schema updated:**
   - `email` column is now nullable
   - `address` column is now nullable  
   - `password` column is now nullable
   - Added `registered_via_otp` boolean flag

2. **Migration script provided** at `backend/migrations/update_users_table.sql`

## Frontend Changes

### LoginModal.tsx
- Removed phone number existence checking
- Always proceeds directly to OTP flow
- Handles both new and existing users seamlessly
- Updated UI text to reflect OTP-only flow

### Login.tsx  
- Simplified to always open OTP modal
- Removed password-based login flow

## Configuration

### Test Mode
The system supports test mode for development:
- Set `TEST_MODE = true` in `backend/services/otpService.js`
- Test OTP is always `123456`
- No actual SMS is sent in test mode

### Twilio Configuration
For production, ensure these environment variables are set:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN` 
- `TWILIO_PHONE_NUMBER`

## Benefits

1. **Simplified User Experience**: One-step authentication
2. **Reduced Friction**: No need to remember passwords
3. **Phone Verification**: All users have verified phone numbers
4. **Progressive Data Collection**: Email and other details can be collected later when needed

## User Profile Completion

Users can update their profile information later through:
- User profile page
- During checkout process
- When accessing features that require additional information

## Security Considerations

1. OTP expires after 5 minutes
2. Maximum 3 verification attempts per OTP
3. Rate limiting on OTP sending (implemented in Twilio service)
4. Phone numbers are the primary identifier and must be unique

## Migration for Existing Users

Existing users with password-based accounts can still use the OTP flow:
1. They enter their phone number
2. Receive OTP
3. Verify OTP to log in
4. Their existing account data remains intact

## Testing

To test the new flow:
1. Ensure `TEST_MODE = true` in OTP service
2. Enter any valid phone number format
3. Use OTP `123456` for verification
4. Check that user account is created/logged in automatically