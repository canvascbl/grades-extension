zip:
	GOOS=linux go build -o bin/authorizer ./*.go;
	zip bin/authorizer.zip bin/authorizer

upload:
	aws lambda update-function-code --function-name canvascbl-tinyapi-grades-extension --zip-file fileb://./bin/authorizer.zip