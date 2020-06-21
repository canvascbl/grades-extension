interface tokenGrantResponse {
  access_token: string
  refresh_token: string
  user: {
    id: number
  }
  expires_at: string
}

const apiBaseUrl = process.env

// request
function getOAuth2RequestUrl(): string {
  return process.env.OAUTH2_REDIRECT_URI;
}

function getOAuth2TokenFromCode(code: string): tokenGrantResponse {
  try {
    const
  }
}