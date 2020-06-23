package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"
)

var client = &http.Client{}
var tokenURL = url.URL{
	Scheme: "https",
	Host:   "api.canvascbl.com",
	Path:   "api/oauth2/token",
}

func makeTokenRequest(code *string, refreshToken *string) (*[]byte, *int, *int64, error) {
	grantType := "authorization_code"

	if refreshToken != nil {
		grantType = "refresh_token"
	}

	// make a copy
	u := *&tokenURL
	q := u.Query()
	q.Add("grant_type", grantType)
	q.Add("client_id", OAuth2ClientID)
	q.Add("client_secret", OAuth2ClientSecret)
	q.Add("redirect_uri", OAuth2RedirectURI)
	if code != nil {
		q.Add("code", *code)
	}
	if refreshToken != nil {
		q.Add("refresh_token", *refreshToken)
	}
	u.RawQuery = q.Encode()

	start := time.Now()
	resp, err := client.Post(u.String(), "", nil)
	if err != nil {
		return nil, nil, nil, fmt.Errorf("error making token post request: %w", err)
	}
	dur := time.Since(start).Milliseconds()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, nil, nil, fmt.Errorf("error reading body from token post request %w", err)
	}

	return &body, &resp.StatusCode, &dur, nil
}
