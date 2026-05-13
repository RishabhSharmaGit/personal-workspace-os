#!/usr/bin/env bash
# Claude Code status line script
# Displays: cwd (basename) | git branch | model name | context usage

input=$(cat)

# Current working directory — prefer workspace.current_dir from JSON, fall back to $PWD
cwd=$(echo "$input" | jq -r '.workspace.current_dir // ""')
[ -z "$cwd" ] && cwd="$PWD"
# Show only the basename for brevity
cwd_display=$(basename "$cwd")

# Git branch (skip optional locks to avoid stalling)
git_branch=$(git -C "$cwd" --no-optional-locks branch --show-current 2>/dev/null)

# Model display name
model=$(echo "$input" | jq -r '.model.display_name // "Unknown"')

# Context window percentage
used_pct=$(echo "$input" | jq -r '.context_window.used_percentage // empty')

if [ -n "$used_pct" ]; then
  # Build a 10-segment progress bar
  filled=$(echo "$used_pct" | awk '{printf "%d", int($1 / 10 + 0.5)}')
  bar=""
  for i in $(seq 1 10); do
    if [ "$i" -le "$filled" ]; then
      bar="${bar}█"
    else
      bar="${bar}░"
    fi
  done
  pct_display=$(printf "%.0f" "$used_pct")
  ctx_part="[${bar}] ${pct_display}%"
else
  ctx_part="[░░░░░░░░░░] --%"
fi

# Assemble status line with dimmed ANSI colors
# dim white for cwd, dim magenta for branch, dim cyan for model, dim yellow for context bar
printf "\033[2;37m%s\033[0m" "$cwd_display"
if [ -n "$git_branch" ]; then
  printf " \033[2m|\033[0m "
  printf "\033[2;35m%s\033[0m" "$git_branch"
fi
printf " \033[2m|\033[0m "
printf "\033[2;36m%s\033[0m" "$model"
printf " \033[2m|\033[0m "
printf "\033[2;33m%s\033[0m" "$ctx_part"
printf "\n"
