# Form.io Authentication Solutions

Your form is showing "Unauthorized" error because it requires authentication. Here are your options:

## Option 1: Make the Form Public (Easiest for Testing)

1. Go to the Form.io Portal: https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu/manage/view/
2. Navigate to your form: `publicaerform1`
3. Click on "Access" or "Permissions" tab
4. Enable **Anonymous** access or make it **Public**
5. Save the form

Once done, the current App.tsx should work without authentication!

## Option 2: Use Authentication with Login

If your form must remain private, use the `AppWithAuth.tsx` version:

1. Replace the import in `src/index.tsx`:

   ```tsx
   import App from './AppWithAuth';
   ```

2. Users will need to login with their Form.io credentials before accessing forms

## Option 3: Use API Key Authentication

If you have a Form.io API key:

1. Get your API key from Form.io Project Settings
2. Open `src/AppWithApiKey.tsx`
3. Add your API key:
   ```tsx
   const API_KEY = 'your-api-key-here';
   ```
4. Replace the import in `src/index.tsx`:
   ```tsx
   import App from './AppWithApiKey';
   ```

## Understanding the URLs

### Management UI URL (Browser Only)

```
https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu/manage/view/#/form/publicaerform1
```

This is for the Form.io admin interface - **NOT** for API calls.

### API Endpoint (Correct for React App)

```
https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu/publicaerform1
```

This is the proper API endpoint your React app should use.

## Current Configuration

Your `App.tsx` is now correctly configured with:

- ✅ Correct project URL: `https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu`
- ✅ Correct form path: `/publicaerform1`
- ✅ FormioProvider with proper baseUrl and projectUrl

## Next Steps

1. **Try Option 1 first** (make form public) - quickest solution
2. If you need authentication, switch to AppWithAuth.tsx or AppWithApiKey.tsx
3. Make sure CORS is configured on Azure to allow `http://localhost:3000`

## CORS Configuration (Azure)

Don't forget to add CORS settings in Azure Portal:

1. Go to your Azure App Service: `formio-api-dev`
2. Navigate to: Settings → CORS
3. Add allowed origin: `http://localhost:3000`
4. Save changes

## Testing

Once configured, your form should load successfully at:

```
http://localhost:3000
```

The input field allows you to switch between different forms in your project by entering the form path (e.g., `publicaerform1`, `myotherform`, etc.)
