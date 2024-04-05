package api

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"os"
	"strings"
)

const DebugVar = "httpdebug"

func selectedEndpoint(endpoint string) bool {
	wantedEndpointsRaw := os.Getenv(DebugVar)
	if wantedEndpointsRaw == "" {
		return false
	}
	if wantedEndpointsRaw == "*" {
		return true
	}
	wantedEndpoints := strings.Split(wantedEndpointsRaw, ",")
	for _, wantedEndpoint := range wantedEndpoints {
		if strings.HasPrefix(endpoint, wantedEndpoint) {
			return true
		}
	}
	return false
}

func DebugRequest(req *http.Request) {
	if selectedEndpoint(req.URL.Path) {
		output, err := httputil.DumpRequestOut(req, true)
		if err == nil {
			fmt.Printf("\n\n%s\n\n", output)
		} else {
			fmt.Fprintf(os.Stderr, "request errored out: %s\n", err)
		}
	}
}

func DebugResponse(res *http.Response) {
	if selectedEndpoint(res.Request.URL.Path) {
		output, err := httputil.DumpResponse(res, true)
		if err == nil {
			fmt.Printf("\n\n%s\n\n", output)
		} else {
			fmt.Fprintf(os.Stderr, "request errored out: %s\n", err)
		}
	}
}
