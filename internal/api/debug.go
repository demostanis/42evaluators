package api

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"os"
)

const DEBUG_VAR = "httpdebug"

func DebugRequest(req *http.Request) {
	if os.Getenv(DEBUG_VAR) != "" {
		output, err := httputil.DumpRequestOut(req, true)
		if err == nil {
			fmt.Printf("\n\n%s\n\n", output)
		} else {
			fmt.Fprintf(os.Stderr, "request errored out: %s\n", err)
		}
	}
}

func DebugResponse(res *http.Response) {
	if os.Getenv(DEBUG_VAR) != "" {
		output, err := httputil.DumpResponse(res, true)
		if err == nil {
			fmt.Printf("\n\n%s\n\n", output)
		} else {
			fmt.Fprintf(os.Stderr, "request errored out: %s\n", err)
		}
	}
}
