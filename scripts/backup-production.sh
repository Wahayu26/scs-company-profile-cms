#!/usr/bin/env bash
set -Eeuo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backup_root="${BACKUP_DIR:-/opt/scs-company-profile/backups}"
postgres_container="${CMS_POSTGRES_CONTAINER:-scs-company-profile-postgres-1}"
cms_container="${CMS_CONTAINER:-scs-company-profile-cms-cms-1}"
timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="${backup_root}/${timestamp}"

cd "${project_dir}"
docker inspect "${postgres_container}" >/dev/null
docker inspect "${cms_container}" >/dev/null

media_source="$(docker inspect "${cms_container}" --format '{{range .Mounts}}{{if eq .Destination "/app/public/media"}}{{.Source}}{{end}}{{end}}')"
if [[ -z "${media_source}" || ! -d "${media_source}" ]]; then
  echo "CMS media mount could not be resolved." >&2
  exit 1
fi

install -d -m 700 "${backup_dir}"

{
  echo "Created: $(date --iso-8601=seconds)"
  echo "CMS container: ${cms_container}"
  echo "CMS image: $(docker inspect "${cms_container}" --format '{{.Config.Image}}')"
  echo "PostgreSQL container: ${postgres_container}"
  echo "PostgreSQL image: $(docker inspect "${postgres_container}" --format '{{.Config.Image}}')"
  echo "Media source: ${media_source}"
} > "${backup_dir}/inventory.txt"

docker exec "${postgres_container}" sh -ceu \
  'pg_dump -U "$POSTGRES_USER" -d scs_cms -Fc' \
  > "${backup_dir}/scs_cms.dump"

tar -C "${media_source}" -czf "${backup_dir}/cms-media.tar.gz" .

docker exec -i "${postgres_container}" pg_restore -l \
  < "${backup_dir}/scs_cms.dump" >/dev/null
tar -tzf "${backup_dir}/cms-media.tar.gz" >/dev/null

sha256sum \
  "${backup_dir}/scs_cms.dump" \
  "${backup_dir}/cms-media.tar.gz" \
  > "${backup_dir}/SHA256SUMS"
chmod 600 "${backup_dir}/"*

echo "BACKUP_OK=${backup_dir}"
du -h "${backup_dir}/scs_cms.dump" "${backup_dir}/cms-media.tar.gz"
cat "${backup_dir}/SHA256SUMS"
