variable "GITHUB_REPO" {
    type = string
}

data "github_actions_public_key" "lambda_endpoint_public_key" {
  repository = var.GITHUB_REPO
}

resource "github_actions_secret" "lambda_endpoint" {
  repository       = var.GITHUB_REPO
  secret_name      = "lambda_endpoint"
  plaintext_value  = var.some_secret_string
}

resource "aws_lambda_function" "lambda_function" {
    
}