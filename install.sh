#!/bin/sh
# Install rufous: curl -fsSL https://rufous.chat/install.sh | sh
#
# Downloads the release archive for this machine from GitHub (stephanfeb/rufous), checks its
# SHA-256, and puts the `rufous` binary in ~/.local/bin. No sudo, nothing else is touched.
#
#   RUFOUS_VERSION      a release tag such as v0.2.0 (default: the latest release)
#   RUFOUS_INSTALL_DIR  where the binary goes (default: ~/.local/bin)
#
# The asset names match .github/workflows/release.yml in the rufous repository.
set -eu

REPO="stephanfeb/rufous"
VERSION="${RUFOUS_VERSION:-latest}"
INSTALL_DIR="${RUFOUS_INSTALL_DIR:-$HOME/.local/bin}"

say() { printf '%s\n' "$*"; }
fail() { printf 'rufous install: %s\n' "$*" >&2; exit 1; }

case "$(uname -s)" in
  Darwin) os=apple-darwin ;;
  Linux) os=unknown-linux-gnu ;;
  MINGW* | MSYS* | CYGWIN*)
    fail "on Windows, download rufous-x86_64-pc-windows-msvc.zip from https://github.com/$REPO/releases/latest" ;;
  *) fail "unsupported system: $(uname -s)" ;;
esac
case "$(uname -m)" in
  arm64 | aarch64) arch=aarch64 ;;
  x86_64 | amd64) arch=x86_64 ;;
  *) fail "unsupported processor: $(uname -m)" ;;
esac
target="$arch-$os"
asset="rufous-$target.tar.gz"

if [ -n "${RUFOUS_DOWNLOAD_BASE:-}" ]; then
  base="$RUFOUS_DOWNLOAD_BASE"
elif [ "$VERSION" = latest ]; then
  base="https://github.com/$REPO/releases/latest/download"
else
  base="https://github.com/$REPO/releases/download/$VERSION"
fi

command -v curl >/dev/null 2>&1 || fail "curl is required"
command -v tar >/dev/null 2>&1 || fail "tar is required"
if command -v sha256sum >/dev/null 2>&1; then sha() { sha256sum "$1" | cut -d' ' -f1; }
elif command -v shasum >/dev/null 2>&1; then sha() { shasum -a 256 "$1" | cut -d' ' -f1; }
else fail "sha256sum or shasum is required to check the download"; fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT INT TERM

say "Downloading rufous ($VERSION) for $target"
curl -fsSL "$base/$asset" -o "$tmp/$asset" || fail "could not download $base/$asset"
curl -fsSL "$base/$asset.sha256" -o "$tmp/$asset.sha256" || fail "could not download the checksum"

want="$(cut -d' ' -f1 < "$tmp/$asset.sha256")"
got="$(sha "$tmp/$asset")"
[ "$want" = "$got" ] || fail "checksum mismatch for $asset (expected $want, got $got)"

tar -xzf "$tmp/$asset" -C "$tmp"
mkdir -p "$INSTALL_DIR"
cp "$tmp/rufous-$target/rufous" "$INSTALL_DIR/rufous.tmp"
chmod 755 "$INSTALL_DIR/rufous.tmp"
mv "$INSTALL_DIR/rufous.tmp" "$INSTALL_DIR/rufous"

say "Installed $("$INSTALL_DIR/rufous" --version 2>/dev/null || echo rufous) to $INSTALL_DIR/rufous"
case ":$PATH:" in
  *":$INSTALL_DIR:"*) ;;
  *)
    say ""
    say "$INSTALL_DIR is not on your PATH. Add it, for example:"
    say "  echo 'export PATH=\"$INSTALL_DIR:\$PATH\"' >> ~/.profile"
    ;;
esac
say ""
say "Next: run a model under Ollama (https://ollama.com), then"
say "  ollama pull qwen3.5:4b"
say "  rufous doctor"
