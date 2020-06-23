package main

import (
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"net/http"
	"net/url"
	"strconv"
)

var OAuth2RequestURL = getOAuth2RequestURL()

func getOAuth2RequestURL() string {
	u := url.URL{
		Scheme: "https",
		Host:   "api.canvascbl.com",
		Path:   "api/oauth2/auth",
	}
	q := u.Query()
	q.Add("response_type", "code")
	q.Add("client_id", OAuth2ClientID)
	q.Add("redirect_uri", OAuth2RedirectURI)
	q.Add("scope", OAuth2Scope)
	q.Add("purpose", "CanvasCBL Grades Extension for Canvas")
	u.RawQuery = q.Encode()

	return u.String()
}

func getRedirectResponse(url string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusFound,
		Headers: map[string]string{
			"Location": url,
		},
	}
}

func sendStatusWithReason(status int, reason string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode:      status,
		Body:            reason,
		IsBase64Encoded: false,
	}
}

func generateServerTimingHeader(dur int64) string {
	return fmt.Sprintf("api;dur=%d;desc=\"CanvasCBL API\"", dur)
}

func HandleLambdaEvent(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	action := req.PathParameters["action"]

	switch action {
	case "request":
		return getRedirectResponse(OAuth2RequestURL), nil
	case "response":
		u := *ExtensionCodeURI
		q := u.Query()
		for k, v := range req.QueryStringParameters {
			q.Add(k, v)
		}
		u.RawQuery = q.Encode()
		return getRedirectResponse(u.String()), nil
	case "token":
		code := req.QueryStringParameters["code"]
		if len(code) < 1 {
			return sendStatusWithReason(http.StatusBadRequest, "missing code as query param"), nil
		}
		resp, statusCode, dur, err := makeTokenRequest(&code, nil)

		apiResp := events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadGateway,
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
			IsBase64Encoded: false,
		}

		if dur != nil {
			apiResp.Headers["Server-Timing"] = generateServerTimingHeader(*dur)
		}

		if statusCode != nil {
			apiResp.Headers["X-CanvasCBL-API-Status-Code"] = strconv.Itoa(*statusCode)
			apiResp.StatusCode = *statusCode
		}

		if resp != nil {
			apiResp.Body = string(*resp)
		}

		if err != nil {
			return apiResp, fmt.Errorf("error from makeTokenRequest (canvascbl api status code %d): %w", statusCode, err)
		}

		return apiResp, nil
	case "refresh-token":
		refreshToken := req.QueryStringParameters["refresh_token"]
		if len(refreshToken) < 1 {
			return sendStatusWithReason(http.StatusBadRequest, "missing refresh_token as query param"), nil
		}

		resp, statusCode, dur, err := makeTokenRequest(nil, &refreshToken)

		apiResp := events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadGateway,
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
			IsBase64Encoded: false,
		}

		if dur != nil {
			apiResp.Headers["Server-Timing"] = generateServerTimingHeader(*dur)
		}

		if statusCode != nil {
			apiResp.Headers["X-CanvasCBL-API-Status-Code"] = strconv.Itoa(*statusCode)
			apiResp.StatusCode = *statusCode
		}

		if resp != nil {
			apiResp.Body = string(*resp)
		}

		if err != nil {
			return apiResp, fmt.Errorf("error from makeTokenRequest (canvascbl api status code %d): %w", statusCode, err)
		}

		return apiResp, nil
	}

	return sendStatusWithReason(http.StatusNotFound, "404 not found"), nil
}

func main() {
	lambda.Start(HandleLambdaEvent)
}
