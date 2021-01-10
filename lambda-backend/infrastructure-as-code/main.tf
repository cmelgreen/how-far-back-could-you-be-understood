provider "aws" {
    region = "us-west-2"
}

resource "aws_api_gateway_rest_api" "api" {
  name = "how_far_back_api"
}

resource "aws_api_gateway_resource" "resource" {
  path_part   = "first-use"
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.api.id
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.resource.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "api_deployment" {
   depends_on = [
     aws_api_gateway_integration.integration,
   ]

   rest_api_id = aws_api_gateway_rest_api.api.id
   stage_name  = "how-far-back"
}

output "base_url" {
  value = aws_api_gateway_deployment.api_deployment.invoke_url
}


resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*"
}

resource "aws_lambda_function" "lambda" {
  filename      = "../backend.zip"
  function_name = "how-far-back-lambda"
  handler       = "backend.lambda_handler"
  runtime       = "python3.8"
  role          = aws_iam_role.lambda_iam.arn
}

resource "aws_iam_role" "lambda_iam" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "iam_ssm_attachment" {
  role = aws_iam_role.lambda_iam.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}


# variable "GITHUB_REPO" {
#     type = string
# }

# data "github_actions_public_key" "lambda_endpoint_public_key" {
#   repository = var.GITHUB_REPO
# }

# resource "github_actions_secret" "lambda_endpoint" {
#   repository       = var.GITHUB_REPO
#   secret_name      = "lambda_endpoint"
#   plaintext_value  = var.some_secret_string
# }