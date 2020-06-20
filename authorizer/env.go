package main

import (
	"fmt"
	"net/url"
	"os"
)

var (
	OAuth2ClientID = getEnvOrPanic("OAUTH2_CLIENT_ID")
	OAuth2ClientSecret = getEnvOrPanic("OAUTH2_CLIENT_SECRET")
	OAuth2RedirectURI = getEnvOrPanic("OAUTH2_REDIRECT_URI")
	ExtensionCodeURI = func() *url.URL {
		uri := getEnvOrPanic("EXTENSION_CODE_URI")
		u, err := url.Parse(uri)
		if err != nil {
			panic(fmt.Errorf("error parsing extension code uri: %w", err))
		}

		return u
	}()
)

func getEnvOrPanic(key string) string {
	value, ok := os.LookupEnv(key)
	if !ok {
		panic(fmt.Sprintf("Missing required environment variable '%v'\n", key))
	}
	return value
}

func getEnv(key string, fallback string) string {
	if v, ok := os.LookupEnv(key); ok {
		return v
	}

	return fallback
}