
serve:
	java -jar ./plovr.jar serve debug.json
build:
	java -jar ./plovr.jar build main.json > deploy/index.js
lint:
	fixjsstyle --strict -r ./src
	gjslint --strict -r ./src
soyweb:
	java -jar ./plovr.jar soyweb --dir .