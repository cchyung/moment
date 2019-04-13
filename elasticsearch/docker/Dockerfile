FROM docker.elastic.co/elasticsearch/elasticsearch-platinum:6.2.4

WORKDIR /usr/share/elasticsearch
COPY config config
# COPY scripts/create_templates.sh ./

#USER root
RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch
USER  elasticsearch

# Set environment variables defaults
ENV ES_JAVA_OPTS "-Xms512m -Xmx512m"
ENV NODE_MASTER true
ENV NODE_DATA true
ENV NODE_INGEST true
ENV HTTP_ENABLE true
ENV NETWORK_HOST _site_
ENV HTTP_CORS_ENABLE true
ENV HTTP_CORS_ALLOW_ORIGIN *
ENV NUMBER_OF_MASTERS 1
ENV MAX_LOCAL_STORAGE_NODES 1
ENV SHARD_ALLOCATION_AWARENESS ""
ENV SHARD_ALLOCATION_AWARENESS_ATTR ""
ENV REPO_LOCATIONS []
ENV NODE_ENV es-discovery
ENV CLUSTER_NAME es-cluster
ENV NODE_NAME node_name
ENV REMOTE_WHITE_LIST "1.2.3.4:9200"
ENV CACHE_SIZE 20


# Set environment
ENV DISCOVERY_SERVICE es-discovery

# Kubernetes requires swap is turned off, so memory lock is redundant
ENV MEMORY_LOCK false
ARG PASS
RUN echo $PASS | bin/elasticsearch-keystore add --stdin "bootstrap.password"

USER root
RUN bin/elasticsearch-plugin install repository-gcs
RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch
USER  elasticsearch

# Volume for Elasticsearch data
VOLUME ["/data"]

ENTRYPOINT ["bin/elasticsearch"]