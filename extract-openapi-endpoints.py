import yaml

# Load your OpenAPI YAML file
with open("assets/openapi_v2.yaml", "r") as api_file:
    api = yaml.safe_load(api_file)

    
# List all endpoints
if "paths" in api:
    for path, path_item in api["paths"].items():
        if path == "/api/v4/projects":
            print(f"Endpoint: {path}")
            for method, operation in path_item.items():
                print(f"Method: {method}")
                dataName = operation["operationId"].split("_")[0]
                if method.lower() == "get":
                    function_def = f"""
    export const {method.lower()}Data(
        ['projects', params.query],
        `{path}`,
        params
    )"""
                elif method.lower() == "post":
                    function_def = f"""
export const {method.lower()}Data(
        ['projects', params.query],
        `{path}`,
        params
    )"""
                elif method.lower() == "put":
                   function_def = f"""
export const {method.lower()}Data(
        ['projects', params.query],
        `{path}`,
        params
    )"""        
                elif method.lower() == "delete":
                    function_def = f"""
export const {method.lower()}Data(
        ['projects', params.query],
        `{path}`,
        params
    )"""

                print(function_def)     
                if "parameters" in operation:
                    print("Parameters:")
                    for param in operation["parameters"]:
                        print(f"  - {param['name']} ({param['in']})")
                if "responses" in operation:
                    for status_code, response in operation["responses"].items():
                        if "schema" in response and "$ref" in response["schema"] and "query" in response["schema"]["$ref"]:
                            print("Query Parameters:")
                            query_schema_ref = response["schema"]["$ref"].split("/")[-1]
                            if query_schema_ref in api["components"]["schemas"]:
                                query_schema = api["components"]["schemas"][query_schema_ref]
                                if "properties" in query_schema:
                                    for param_name, param_details in query_schema["properties"].items():
                                        print(f"  - {param_name} ({param_details['type']})")

else:
    print("No 'paths' object found in the OpenAPI YAML file.")
