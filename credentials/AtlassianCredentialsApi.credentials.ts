import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AtlassianCredentialsApi implements ICredentialType {
	name = 'atlassianCredentialsApi';
	displayName = 'Atlassian Credentials API';
	icon: Icon = 'file:atlassian.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: '',
			placeholder: 'https://your-domain.atlassian.net',
			required: true,
		},
		{
			displayName: 'User Name',
			name: 'username',
			type: 'string',
			default: '',
			placeholder: 'username@your-domain.com',
			required: true,
			hint: 'https://id.atlassian.com/manage-profile/profile-and-visibility',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			hint: 'https://id.atlassian.com/manage-profile/security/api-tokens',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{ $credentials.username }}',
				password: '={{ $credentials.apiKey }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.domain}}',
			url: '/wiki/api/v2/spaces?limit=1',
		},
	};
}
