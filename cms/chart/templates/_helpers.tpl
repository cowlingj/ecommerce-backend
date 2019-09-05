{{- define "general.service.type" }}
  {{- if and .Values.env (eq .Values.env "development") -}}
    {{ "NodePort" }}
  {{- else -}}
    {{ "ClusterIP" }}
  {{- end -}}
{{- end }}