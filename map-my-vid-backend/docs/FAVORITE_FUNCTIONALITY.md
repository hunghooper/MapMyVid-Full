# Favorite Functionality Documentation

## Overview
The favorite functionality allows users to mark locations as favorites and manage them through various endpoints. This feature enhances user experience by enabling quick access to preferred locations.

## Database Schema
The `isFavorite` field has been added to the `Location` model in the Prisma schema:

```prisma
model Location {
  // ... other fields
  isFavorite      Boolean   @default(false) @map("is_favorite")
  // ... other fields
}
```

## API Endpoints

### 1. Get All Favorites
**GET** `/api/locations/favorites`

Retrieves all favorite locations for the authenticated user.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Number of items per page (default: 20, max: 100)
- `videoId` (optional): Filter by specific video ID

#### Response
```json
{
  "data": [
    {
      "id": "location-uuid",
      "videoId": "video-uuid",
      "originalName": "Restaurant Name",
      "type": "RESTAURANT",
      "context": "Location context",
      "aiAddress": "AI generated address",
      "googleName": "Google place name",
      "formattedAddress": "Formatted address",
      "latitude": 10.123456,
      "longitude": 106.123456,
      "placeId": "google_place_id",
      "rating": 4.5,
      "googleMapsUrl": "https://maps.google.com/...",
      "types": ["restaurant", "food"],
      "searchStatus": "FOUND",
      "isFavorite": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 20
}
```

### 2. Toggle Favorite Status
**PATCH** `/api/locations/:id/favorite`

Toggles the favorite status of a location (true ↔ false).

#### Path Parameters
- `id`: Location ID

#### Response
```json
{
  "id": "location-uuid",
  "videoId": "video-uuid",
  "originalName": "Restaurant Name",
  "type": "RESTAURANT",
  "context": "Location context",
  "isFavorite": true,
  // ... other fields
}
```

### 3. Set Favorite Status
**PATCH** `/api/locations/:id/favorite/set`

Sets the favorite status of a location to a specific value.

#### Path Parameters
- `id`: Location ID

#### Request Body
```json
{
  "isFavorite": true
}
```

#### Response
```json
{
  "id": "location-uuid",
  "videoId": "video-uuid",
  "originalName": "Restaurant Name",
  "type": "RESTAURANT",
  "context": "Location context",
  "isFavorite": true,
  // ... other fields
}
```

### 4. Get All Locations (with favorites filter)
**GET** `/api/locations`

Retrieves all locations with optional filtering by favorites.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Number of items per page (default: 20, max: 100)
- `videoId` (optional): Filter by specific video ID
- `favoritesOnly` (optional): Filter to show only favorites (default: false)

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "User ID and location ID are required",
  "error": "Bad Request"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Location not found",
  "error": "Not Found"
}
```

### Error Messages
- `FAILED_TOGGLE_FAVORITE`: Failed to toggle favorite status
- `FAILED_SET_FAVORITE`: Failed to set favorite status
- `INVALID_FAVORITE_STATUS`: Invalid favorite status value
- `LOCATION_ID_REQUIRED`: User ID and location ID are required
- `NOT_FOUND`: Location not found

## Usage Examples

### JavaScript/TypeScript
```typescript
// Get all favorites
const favorites = await fetch('/api/locations/favorites', {
  headers: { 'Authorization': 'Bearer ' + token }
});

// Toggle favorite status
const toggled = await fetch('/api/locations/location-id/favorite', {
  method: 'PATCH',
  headers: { 'Authorization': 'Bearer ' + token }
});

// Set favorite status to true
const setFavorite = await fetch('/api/locations/location-id/favorite/set', {
  method: 'PATCH',
  headers: { 
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ isFavorite: true })
});

// Get all locations with favorites filter
const allLocations = await fetch('/api/locations?favoritesOnly=true', {
  headers: { 'Authorization': 'Bearer ' + token }
});
```

### cURL Examples
```bash
# Get all favorites
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/locations/favorites"

# Toggle favorite status
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/locations/location-id/favorite"

# Set favorite status
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isFavorite": true}' \
  "http://localhost:3000/api/locations/location-id/favorite/set"
```

## Testing

The favorite functionality includes comprehensive unit tests covering:
- Toggle favorite status (true ↔ false)
- Set favorite status directly
- Error handling for missing parameters
- Error handling for non-existent locations
- Database error handling
- Filtering by favorites in list endpoints

Run tests with:
```bash
npm test -- locations.service.spec.ts
```

## Security Considerations

1. **Authentication Required**: All favorite endpoints require valid JWT authentication
2. **User Isolation**: Users can only manage favorites for their own locations
3. **Input Validation**: All inputs are validated using class-validator decorators
4. **Error Handling**: Sensitive information is not exposed in error messages

## Performance Considerations

1. **Database Indexing**: The `isFavorite` field is indexed for optimal query performance
2. **Pagination**: All list endpoints support pagination to handle large datasets
3. **Efficient Queries**: Database queries are optimized to minimize data transfer

## Migration

The `isFavorite` field was added via a Prisma migration:
```sql
-- Migration: 20251025062948_add_is_favorite_to_locations
ALTER TABLE "locations" ADD COLUMN "is_favorite" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "locations_is_favorite_idx" ON "locations"("is_favorite");
```

To apply the migration:
```bash
npx prisma migrate deploy
```
