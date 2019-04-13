envsubst < discovery-service.yaml | kubectl apply -f - &&
envsubst < kibana-service.yaml | kubectl apply -f - &&
envsubst < client-service.yaml | kubectl apply -f - &&
envsubst < master.yaml | kubectl apply -f - &&
envsubst < ssd.yaml | kubectl apply -f - &&
envsubst < data.yaml | kubectl apply -f - &&
envsubst < client.yaml | kubectl apply -f - &&
envsubst < kibana.yaml | kubectl apply -f -