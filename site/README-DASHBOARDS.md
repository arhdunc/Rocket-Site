# Dashboard Hub - Adding New Dashboards

## Quick Start

To add a new dashboard to the hub, edit the file `public/src/data/dashboards.json` and add your dashboard to the `dashboards` array.

## Dashboard Structure

```json
{
  "id": "unique-dashboard-id",
  "title": "Dashboard Display Name",
  "description": "Brief description of what this dashboard shows",
  "url": "https://link-to-your-dashboard.com",
  "platform": "Power BI | Tableau | SharePoint | Kubernetes | Python Dash",
  "category": "Sales | Finance | Marketing | Operations | Human Resources",
  "tags": ["tag1", "tag2", "tag3"],
  "image": "/images/your-image.png",
  "lastUpdated": "2024-01-15",
  "isActive": true
}
```

## Required Fields

- **id**: Unique identifier (lowercase, no spaces)
- **title**: Display name for the dashboard
- **description**: Brief explanation of the dashboard's purpose
- **url**: Direct link to the dashboard
- **platform**: One of the supported platforms
- **category**: Logical grouping for filtering
- **isActive**: Set to `true` to show, `false` to hide

## Adding Images

1. Place your dashboard screenshot in `public/images/`
2. Reference it in JSON as `"/images/your-image.png"`

## Available Images

- `Sales.png` - For sales-related dashboards
- `Customer.png` - For customer analytics
- `HR.png` - For HR metrics
- `Inventory.png` - For inventory management
- `System Health.png` - For system monitoring
- `financial-overview.png` - For financial dashboards

## Testing

After editing the JSON file, refresh the dashboard hub page to see your changes immediately.

## File Locations

- **Dashboard Data**: `public/src/data/dashboards.json`
- **Images**: `public/images/`
- **Hub Page**: Main site index (automatically loads from JSON)

The system is now simplified and reliable - no build steps required! 