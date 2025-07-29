~# @bitovi/n8n-nodes-confluence

This is an n8n community node. It lets you use Atlassian Confluence in your n8n workflows.

Confluence is a collaborative workspace and documentation platform by Atlassian, used for creating, organizing, and sharing content with your team.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

- Make sure to allow community nodes with `N8N_COMMUNITY_PACKAGES_ENABLED=true`
- Once logged in to your N8N web UI, go to `/settings/community-nodes` and type `@bitovi/n8n-nodes-confluence`

## Operations

- **Get Spaces**: List Confluence spaces.
- **Get Pages in Space**: List pages within a space.
- **Custom API call**: Use Confluence's REST API.

## Credentials

This node requires authentication with Atlassian Confluence.

- **Domain**: Your Atlassian site URL (e.g., `https://your-domain.atlassian.net`).
- **User Name**: Your Atlassian account email.
- **API Key**: Generate an API token from your Atlassian account ([API tokens](https://id.atlassian.com/manage-profile/security/api-tokens)).

## Compatibility

- Node version: 1
- Tested with latest n8n version (please update as needed)

## Usage

This node provides extensive filtering and customization options for retrieving Confluence data:

### Basic Operations
- **Get Spaces**: Retrieve all spaces or filter by specific space names using comma-separated values
- **Get Pages in Space**: List pages within a specific space using the Space ID

### Filtering Options
- **Title**: Filter pages by exact title match
- **Status**: Choose page status:
  - `current` (default) - Active pages
  - `archived` - Archived pages
  - `deleted` - Deleted pages
  - `trashed` - Trashed pages

### Content Format Options
- **Body Format**: Control how page content is returned:
  - `storage` (default) - Confluence's internal storage format
  - `atlas_doc_format` - Atlas document format for modern editing

### Organization Options
- **Depth**: Control the hierarchy level of pages returned:
  - `all` (default) - All pages regardless of hierarchy level
  - `root` - Only top-level pages

- **Sort**: Order results by various criteria:
  - `modified-date` (descending, default) - Most recently modified first
  - `created-date` - Creation date (ascending/descending)
  - `title` - Alphabetical by title (ascending/descending)
  - `id` - By page ID (ascending/descending)

### Pagination
- **Return All**: Toggle to get all results or limit the number
- **Limit**: Set maximum number of results when not returning all (default: 50)
- Pagination is automatically handled for large result sets

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Atlassian Confluence REST API documentation](https://developer.atlassian.com/cloud/confluence/rest/)

## Version history

- v1.0.0: Initial release

## Need help or have questions?

Need guidance on leveraging AI agents or N8N for your business? Our [AI Agents workshop](https://hubs.ly/Q02X-9Qq0) will equip you with the knowledge and tools necessary to implement successful and valuable agentic workflows.

## License

[MIT](./LICENSE.md)
~