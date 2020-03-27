#!/bin/bash
set +e

# Yarn audit never returns 0 regardless of the level applied
# As per documentation:
#   Applying the level flag will limit the audit table to vulnerabilities of the corresponding level and above.
#   It will not affect the exit code of the command.
# https://classic.yarnpkg.com/en/docs/cli/audit/#toc-commands
yarn audit --groups dependencies

# The command will exit with a non-0 exit code if there are issues of any severity found.
# The exit code will be a mask of the severities.
#   - 1 for INFO
#   - 2 for LOW
#   - 4 for MODERATE
#   - 8 for HIGH
#   - 16 for CRITICAL
#
# This is a work around to return 0 (so CI doesn't fail) when the level is less than decided level from the table above
# reference: https://github.com/yarnpkg/yarn/issues/7260#issuecomment-506556626
[[ $? -ge 4 ]] && exit 1 || exit 0
