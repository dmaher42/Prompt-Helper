#!/usr/bin/env bash
set -euo pipefail

pushd "$(dirname "$0")/../../backend" >/dev/null
npm install --include=dev
npm run prisma:migrate
npm run prisma:seed
popd >/dev/null
