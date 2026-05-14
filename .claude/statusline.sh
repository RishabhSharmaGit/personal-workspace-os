#!/usr/bin/env bash
# Claude Code dev statusline
# Format: dir | branch[*] | [agent |] model[ · effort] | ctx N% | $cost

input=$(cat)

cwd=$(echo "$input" | jq -r '.workspace.current_dir // .cwd // ""')
[ -z "$cwd" ] && cwd="$PWD"
cwd_display=$(basename "$cwd")

git_branch=$(git -C "$cwd" --no-optional-locks branch --show-current 2>/dev/null)
git_dirty=""
if [ -n "$git_branch" ]; then
  if [ -n "$(git -C "$cwd" --no-optional-locks status --porcelain 2>/dev/null | head -n1)" ]; then
    git_dirty="*"
  fi
fi

agent_name=$(echo "$input" | jq -r '.agent.name // empty')
model=$(echo "$input" | jq -r '.model.display_name // "unknown"')
effort=$(echo "$input" | jq -r '.effort.level // empty')

ctx_remaining=$(echo "$input" | jq -r '.context_window.remaining_percentage // empty')
if [ -z "$ctx_remaining" ]; then
  ctx_used=$(echo "$input" | jq -r '.context_window.used_percentage // empty')
  [ -n "$ctx_used" ] && ctx_remaining=$(echo "$ctx_used" | awk '{printf "%.0f", 100 - $1}')
fi

cost=$(echo "$input" | jq -r '.cost.total_cost_usd // empty')

SEP=$' \033[2m|\033[0m '

printf '\033[2;37m%s\033[0m' "$cwd_display"

if [ -n "$git_branch" ]; then
  printf '%s' "$SEP"
  printf '\033[2;35m%s\033[0m' "$git_branch"
  [ -n "$git_dirty" ] && printf '\033[2;33m%s\033[0m' "$git_dirty"
fi

if [ -n "$agent_name" ]; then
  printf '%s' "$SEP"
  printf '\033[2;32m%s\033[0m' "$agent_name"
fi

printf '%s' "$SEP"
printf '\033[2;36m%s\033[0m' "$model"
if [ -n "$effort" ]; then
  printf '\033[2m · \033[0m'
  printf '\033[2;36m%s\033[0m' "$effort"
fi

if [ -n "$ctx_remaining" ]; then
  printf '%s' "$SEP"
  pct=$(printf "%.0f" "$ctx_remaining")
  filled=$(echo "$ctx_remaining" | awk '{printf "%d", int($1 / 10 + 0.5)}')
  bar=""
  for i in $(seq 1 10); do
    if [ "$i" -le "$filled" ]; then bar="${bar}█"; else bar="${bar}░"; fi
  done
  printf '\033[2;33m[%s] %s%%\033[0m' "$bar" "$pct"
fi

if [ -n "$cost" ]; then
  printf '%s' "$SEP"
  cost_fmt=$(echo "$cost" | awk '{printf "$%.3f", $1}')
  printf '\033[2;34m%s\033[0m' "$cost_fmt"
fi

printf '\n'
