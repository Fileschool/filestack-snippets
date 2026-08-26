// Filestack security demo.

//  1. Attempt to delete the file with a restrictive policy (no "remove")
//     -> Filestack rejects it (HTTP 403).
//  2. Rebuild the security with a permissive policy (includes "remove"),
//     then delete the file -> success (HTTP 200).
package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

var (
	appKey    = envOr("FILESTACK_APP_KEY", "APP KEY")
	appSecret = envOr("FILESTACK_APP_SECRET", "APP SECRET")
	handle    = envOr("FILESTACK_HANDLE", "FILE HANDLE")
)

const fileAPI = "https://www.filestackapi.com/api/file"

// Policy is a Filestack security policy. Only the fields we need are modeled.
// "call" is the whitelist of operations this security grants.
// See https://www.filestack.com/docs/concepts/security/
type Policy struct {
	Expiry int64    `json:"expiry"`
	Handle string   `json:"handle,omitempty"`
	Call   []string `json:"call"`
}

type security struct {
	policy    string // base64url-encoded policy JSON
	signature string // hex HMAC-SHA256(policy) keyed by app secret
}

// buildSecurity encodes and signs a policy, producing the policy/signature
// pair. This is where the App Secret is used; the secret itself is never sent
// over the wire, only the signature derived from it.
func buildSecurity(p Policy) (security, error) {
	raw, err := json.Marshal(p)
	if err != nil {
		return security{}, fmt.Errorf("marshal policy: %w", err)
	}

	encoded := base64.URLEncoding.EncodeToString(raw)

	mac := hmac.New(sha256.New, []byte(appSecret))
	mac.Write([]byte(encoded))
	sig := hex.EncodeToString(mac.Sum(nil))

	return security{policy: encoded, signature: sig}, nil
}

func deleteFile(sec security) (int, string, error) {
	url := fmt.Sprintf("%s/%s?key=%s&policy=%s&signature=%s",
		fileAPI, handle, appKey, sec.policy, sec.signature)

	req, err := http.NewRequest(http.MethodDelete, url, nil)
	if err != nil {
		return 0, "", fmt.Errorf("build request: %w", err)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return 0, "", fmt.Errorf("send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return resp.StatusCode, "", fmt.Errorf("read response: %w", err)
	}
	return resp.StatusCode, string(body), nil
}

func main() {
	expiry := time.Now().Add(time.Hour).Unix()

	// Step 1: restrictive security — read/stat only, NO remove.
	restrictive := Policy{
		Expiry: expiry,
		Handle: handle,
		Call:   []string{"read", "stat"}, // "remove" deliberately omitted
	}
	fmt.Println("== Step 1: attempt delete with security that does NOT allow remove ==")
	restrictedSec, err := buildSecurity(restrictive)
	if err != nil {
		fail(err)
	}
	code, body, err := deleteFile(restrictedSec)
	if err != nil {
		fail(err)
	}
	fmt.Printf("HTTP %d\n%s\n\n", code, trim(body))

	if code == http.StatusOK {
		// Not expected — the restrictive policy should have blocked us.
		fmt.Println("Unexpected: the file was deleted despite the restrictive policy.")
		fmt.Println("Nothing left to demonstrate.")
		return
	}
	fmt.Printf("Delete was blocked as expected (status %d): the policy did not grant \"remove\".\n\n", code)

	// Step 2: permissive security — same policy plus "remove".
	permissive := Policy{
		Expiry: expiry,
		Handle: handle,
		Call:   []string{"read", "stat", "remove"}, // now delete is allowed
	}
	fmt.Println("== Step 2: set security to allow remove, then delete ==")
	allowedSec, err := buildSecurity(permissive)
	if err != nil {
		fail(err)
	}
	code, body, err = deleteFile(allowedSec)
	if err != nil {
		fail(err)
	}
	fmt.Printf("HTTP %d\n%s\n\n", code, trim(body))

	if code == http.StatusOK {
		fmt.Println("Success: file deleted after granting \"remove\" in the security policy.")
		return
	}
	fmt.Printf("Delete still failed (status %d). Check that the app key/secret and handle are valid and that the file exists.\n", code)
	os.Exit(1)
}

func envOr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func trim(s string) string {
	if s == "" {
		return "(empty body)"
	}
	return s
}

func fail(err error) {
	fmt.Fprintln(os.Stderr, "error:", err)
	os.Exit(1)
}
