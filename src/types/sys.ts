export interface HealthResponse {
    initialized: boolean;
    sealed: boolean;
    standby: boolean;
    performance_standby: boolean;
    replication_performance_mode: string;
    replication_dr_mode: string;
    server_time_utc: number;
    version: string;
    cluster_name: string;
    cluster_id: string;
}

export interface InitStatusResponse {
    initialized: boolean;
}

export interface InitRequest {
    secret_shares: number;
    secret_threshold: number;
    pgp_keys?: string[];
    root_token_pgp_key?: string;
    recovery_shares?: number;
    recovery_threshold?: number;
    recovery_pgp_keys?: string[];
    stored_shares?: number;
}

export interface InitResponse {
    keys: string[];
    keys_base64: string[];
    root_token: string;
    recovery_keys?: string[];
    recovery_keys_base64?: string[];
}

export interface SealStatusResponse {
    type: string;
    initialized: boolean;
    sealed: boolean;
    t: number;
    n: number;
    progress: number;
    nonce: string;
    version: string;
    build_date: string;
    migration: boolean;
    cluster_name: string;
    cluster_id: string;
    recovery_seal: boolean;
    storage_type: string;
}

export interface UnsealRequest {
    key?: string;
    reset?: boolean;
    migrate?: boolean;
}

export interface LeaderResponse {
    ha_enabled: boolean;
    is_self: boolean;
    active_time: string;
    leader_address: string;
    leader_cluster_address: string;
    performance_standby: boolean;
    performance_standby_last_remote_wal: number;
}

export interface HANode {
    hostname: string;
    api_address: string;
    cluster_address: string;
    active_node: boolean;
    last_echo: string;
    version: string;
}

export interface HAStatusResponse {
    nodes: HANode[];
}

export interface MountConfig {
    default_lease_ttl?: string | number;
    max_lease_ttl?: string | number;
    force_no_cache?: boolean;
    audit_non_hmac_request_keys?: string[];
    audit_non_hmac_response_keys?: string[];
    listing_visibility?: "unauth" | "hidden";
    passthrough_request_headers?: string[];
    allowed_response_headers?: string[];
    token_type?: string;
    allowed_managed_keys?: string[];
}

export interface MountInput {
    type: string;
    description?: string;
    config?: MountConfig;
    options?: Record<string, string>;
    local?: boolean;
    seal_wrap?: boolean;
    external_entropy_access?: boolean;
}

export interface MountOutput {
    accessor: string;
    config: MountConfig & { default_lease_ttl: number; max_lease_ttl: number };
    description: string;
    external_entropy_access: boolean;
    local: boolean;
    options: Record<string, string> | null;
    seal_wrap: boolean;
    type: string;
    uuid: string;
    plugin_version: string;
    running_sha256: string;
    running_plugin_version: string;
}

export type MountsListResponse = Record<string, MountOutput>;

export interface MountTuneInput {
    default_lease_ttl?: string;
    max_lease_ttl?: string;
    description?: string;
    audit_non_hmac_request_keys?: string[];
    audit_non_hmac_response_keys?: string[];
    listing_visibility?: "unauth" | "hidden";
    passthrough_request_headers?: string[];
    allowed_response_headers?: string[];
    token_type?: string;
}

export interface AuthMethodInput {
    type: string;
    description?: string;
    config?: MountConfig;
    local?: boolean;
}

export interface AuthMethodOutput {
    accessor: string;
    config: MountConfig & { default_lease_ttl: number; max_lease_ttl: number; token_type: string };
    description: string;
    external_entropy_access: boolean;
    local: boolean;
    options: Record<string, string> | null;
    seal_wrap: boolean;
    type: string;
    uuid: string;
    plugin_version: string;
    running_sha256: string;
    running_plugin_version: string;
}

export type AuthMethodsListResponse = Record<string, AuthMethodOutput>;

export interface PolicyListResponse {
    keys: string[];
    policies: string[];
}

export interface PolicyResponse {
    name: string;
    policy: string;
}

export interface PolicyInput {
    policy: string;
}

export interface AuditDeviceInput {
    type: "file" | "syslog" | "socket";
    description?: string;
    options?: Record<string, string>;
    local?: boolean;
}

export interface AuditDeviceOutput {
    type: string;
    description: string;
    options: Record<string, string>;
    local: boolean;
    path: string;
}

export type AuditDevicesListResponse = Record<string, AuditDeviceOutput>;

export interface LeaseLookupResponse {
    id: string;
    issue_time: string;
    expire_time: string;
    last_renewal: string | null;
    renewable: boolean;
    ttl: number;
}

export interface LeaseRenewRequest {
    lease_id: string;
    increment?: number;
}

export interface LeaseRenewResponse {
    lease_id: string;
    renewable: boolean;
    lease_duration: number;
}

export interface LeaseRevokeRequest {
    lease_id: string;
}

export interface LeaseListResponse {
    keys: string[];
}

export interface WrapLookupResponse {
    creation_time: string;
    creation_ttl: number;
    creation_path: string;
}

export interface ToolsHashRequest {
    input: string;
    algorithm?: string;
    format?: "hex" | "base64";
}

export interface ToolsHashResponse {
    sum: string;
}

export interface ToolsRandomRequest {
    bytes?: number;
    format?: "hex" | "base64";
}

export interface ToolsRandomResponse {
    random_bytes: string;
}

export interface KeyStatusResponse {
    term: number;
    install_time: string;
    encryptions: number;
}

export interface RekeyInitRequest {
    secret_shares: number;
    secret_threshold: number;
    pgp_keys?: string[];
    backup?: boolean;
    require_verification?: boolean;
}

export interface RekeyStatusResponse {
    started: boolean;
    nonce: string;
    t: number;
    n: number;
    progress: number;
    required: number;
    pgp_fingerprints: string[] | null;
    backup: boolean;
    verification_required: boolean;
}

export interface RekeyUpdateRequest {
    key: string;
    nonce: string;
}

export interface RekeyUpdateResponse {
    complete: boolean;
    keys?: string[];
    keys_base64?: string[];
    nonce: string;
    pgp_fingerprints: string[] | null;
    backup: boolean;
    verification_required: boolean;
    verification_nonce?: string;
}

export interface GenerateRootInitRequest {
    pgp_key?: string;
}

export interface GenerateRootStatusResponse {
    started: boolean;
    nonce: string;
    progress: number;
    required: number;
    complete: boolean;
    encoded_token?: string;
    encoded_root_token?: string;
    pgp_fingerprint: string;
    otp_length: number;
    otp?: string;
}

export interface GenerateRootUpdateRequest {
    key: string;
    nonce: string;
}

export interface PluginInput {
    sha256: string;
    command: string;
    args?: string[];
    env?: string[];
}

export interface PluginOutput {
    name: string;
    sha256: string;
    command: string;
    args: string[];
    builtin: boolean;
    deprecation_status: string;
    version: string;
}

export interface PluginsListResponse {
    auth: string[];
    database: string[];
    secret: string[];
    detailed: PluginOutput[];
}

export interface NamespaceInput {
    custom_metadata?: Record<string, string>;
}

export interface NamespaceOutput {
    id: string;
    path: string;
    custom_metadata: Record<string, string> | null;
}

export interface NamespacesListResponse {
    keys: string[];
    key_info: Record<string, { id: string; path: string }>;
}

export interface RemountRequest {
    from: string;
    to: string;
}

export interface RemountResponse {
    migration_id: string;
}

export interface CORSConfig {
    enabled?: boolean;
    allowed_origins?: string[];
    allowed_headers?: string[];
}

export interface UIHeaderConfig {
    values: string[];
}
