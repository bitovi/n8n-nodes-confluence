import type {
	DeclarativeRestApiSettings,
	IDataObject,
	IExecutePaginationFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class Confluence implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Confluence',
		icon: 'file:confluence.svg',
		name: 'confluence',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"]}}',
		description: 'Confluence Node',
		defaults: {
			name: 'Confluence',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'atlassianCredentialsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials?.domain}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-resource-with-plural-option
						name: 'Get Spaces',
						value: 'getSpaces',
						routing: {
							request: {
								url: '=/wiki/api/v2/spaces',
							},
							send: {
								paginate: true,
							},
							operations: {
								pagination: handlePagination,
							},
						},
					},
					{
						name: 'Get Pages in Space',
						value: 'getPages',
						routing: {
							send: {
								paginate: true,
							},
							operations: {
								pagination: handlePagination,
							},
						},
					},
				],
				default: 'getSpaces',
			},
			{
				displayName: 'Return All',
				description: 'Whether to return all results or only up to a given limit',
				name: 'returnAll',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						returnAll: [false],
					},
				},
				default: 50,
				routing: {
					request: {
						qs: {
							limit: '={{ $value }}',
						},
					},
				},
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
				},
			},
			{
				displayName: 'Space Names',
				description: 'Comma-separated list of Confluence space names',
				name: 'spaceNames',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['getSpaces'],
					},
				},
				default: '',
				routing: {
					request: {
						qs: {
							keys: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Space ID',
				name: 'spaceId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['getPages'],
					},
				},
				default: '',
				required: true,
				routing: {
					request: {
						url: '=/wiki/api/v2/spaces/{{ $value }}/pages',
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['getPages'],
					},
				},
				options: [
					{
						displayName: 'Body Format',
						name: 'bodyFormat',
						type: 'options',
						options: [
							{
								name: 'Storage',
								value: 'storage',
							},
							{
								name: 'Atlas Doc Format',
								value: 'atlas_doc_format',
							},
						],
						default: 'storage',
						routing: {
							request: {
								qs: {
									'body-format': '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Depth',
						name: 'depth',
						type: 'options',
						options: [
							{
								name: 'All',
								value: 'all',
							},
							{
								name: 'Root',
								value: 'root',
							},
						],
						default: 'all',
						routing: {
							request: {
								qs: {
									depth: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Sort',
						name: 'sort',
						type: 'options',
						options: [
							{
								name: 'Created Date Ascending',
								value: 'created-date',
							},
							{
								name: 'Created Date Descending',
								value: '-created-date',
							},
							{
								name: 'ID Ascending',
								value: 'id',
							},
							{
								name: 'ID Descending',
								value: '-id',
							},
							{
								name: 'Modified Date Ascending',
								value: 'modified-date',
							},
							{
								name: 'Modified Date Descending',
								value: '-modified-date',
							},
							{
								name: 'Title Ascending',
								value: 'title',
							},
							{
								name: 'Title Descending',
								value: '-title',
							},
						],
						default: '-modified-date',
						routing: {
							request: {
								qs: {
									sort: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Current',
								value: 'current',
							},
							{
								name: 'Archived',
								value: 'archived',
							},
							{
								name: 'Deleted',
								value: 'deleted',
							},
							{
								name: 'Trashed',
								value: 'trashed',
							},
						],
						default: 'current',
						routing: {
							request: {
								qs: {
									status: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									title: '={{ $value }}',
								},
							},
						},
					},
				],
			},
		],
	};
}

async function handlePagination(
	this: IExecutePaginationFunctions,
	resultOptions: DeclarativeRestApiSettings.ResultOptions,
): Promise<INodeExecutionData[]> {
	const aggregatedResult: IDataObject[] = [];
	let nextPageUrl: string | undefined;
	const returnAll = this.getNodeParameter('returnAll') as boolean;
	let limit = 250;
	if (!returnAll) {
		limit = this.getNodeParameter('limit') as number;
		resultOptions.maxResults = limit;
	}
	resultOptions.paginate = true;

	do {
		if (nextPageUrl) {
			resultOptions.options.url = nextPageUrl;
		}

		const responseData = await this.makeRoutingRequest(resultOptions);

		for (const page of responseData) {
			if (page.json.results) {
				const currentData = page.json.results as IDataObject[];
				aggregatedResult.push(...currentData);
			}

			if (!returnAll && aggregatedResult.length >= limit) {
				return aggregatedResult.slice(0, limit).map((item) => ({ json: item }));
			}

			nextPageUrl = (page.json._links as IDataObject).next as string | undefined;
		}
	} while (nextPageUrl);

	return aggregatedResult.map((item) => ({ json: item }));
}
