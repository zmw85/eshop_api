#!/bin/bash
# this shell script deploys eshop api to the lambda function

echo "Zipping folder"
zip -q -x "eshop_express_lambda.zip" -r eshop_express_lambda.zip ./
echo "Start uploading zip file to s3"
datestamp=$(date "+%Y%m%d_%H%M%S")
aws s3 cp eshop_express_lambda.zip s3://$npm_package_config_s3BucketName/eshop_express_lambda_$datestamp.zip
echo "Start to deploy new code to lambda"
aws lambda update-function-code --function-name $npm_package_config_lambdaFunctionName --s3-bucket $npm_package_config_s3BucketName --s3-key eshop_express_lambda_$datestamp.zip