package api

import (
	"encoding/json"
	"errors"
	"math"
	"net/http"
	"strconv"
)

func GetPageCount(headers *http.Header, requestError error) (int, error) {
	var syntaxErrorCheck *json.SyntaxError
	if requestError != nil && !errors.As(requestError, &syntaxErrorCheck) {
		// we don't care about JSON parsing errors,
		// since HEAD requests aren't supposed to have
		// content
		return 0, requestError
	}
	if headers == nil {
		return 0, errors.New("response did not contain any headers")
	}
	total, err := strconv.Atoi(headers.Get("X-Total"))
	if err != nil {
		return 0, err
	}
	perPage, err := strconv.Atoi(headers.Get("X-Per-Page"))
	if err != nil {
		return 0, err
	}
	return int(math.Ceil(float64(total) / float64(perPage))), nil
}
