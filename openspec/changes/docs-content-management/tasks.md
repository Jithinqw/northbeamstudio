# Tasks: Docs Content Management

## Phase 1 — Foundation and Database

- [ ] 1.1 Create Sequelize migration for `documents`.
- [ ] 1.2 Create Sequelize migration for `document_drafts`.
- [ ] 1.3 Create Sequelize migration for `document_versions`.
- [ ] 1.4 Create Sequelize migration for `document_publications`.
- [ ] 1.5 Create Sequelize migration for `audit_logs` if not already available.
- [ ] 1.6 Add UUID primary keys and foreign-key constraints.
- [ ] 1.7 Add unique document slug constraint.
- [ ] 1.8 Add unique `(document_id, version_number)` constraint.
- [ ] 1.9 Add unique current-version relationship and appropriate indexes.
- [ ] 1.10 Add database constraints preventing invalid document/version relationships.
- [ ] 1.11 Implement Sequelize models using explicit `Model.init` classes.
- [ ] 1.12 Define model associations in centralized association initialization.
- [ ] 1.13 Add database migration rollback support.
- [ ] 1.14 Verify all migrations against a clean PostgreSQL database.

## Phase 2 — Document Management

- [ ] 2.1 Implement document repository.
- [ ] 2.2 Implement document service.
- [ ] 2.3 Implement document creation.
- [ ] 2.4 Implement internal document listing with pagination.
- [ ] 2.5 Implement document retrieval.
- [ ] 2.6 Implement draft creation.
- [ ] 2.7 Implement draft updates.
- [ ] 2.8 Implement draft revision tracking.
- [ ] 2.9 Implement optimistic concurrency validation.
- [ ] 2.10 Implement draft metadata management.
- [ ] 2.11 Implement document slug validation.
- [ ] 2.12 Implement document preview.
- [ ] 2.13 Add document and draft unit tests.

## Phase 3 — Publishing Engine

- [ ] 3.1 Implement publication service.
- [ ] 3.2 Validate document publication eligibility.
- [ ] 3.3 Implement complete draft snapshot creation.
- [ ] 3.4 Generate sequential version numbers per document.
- [ ] 3.5 Implement transactional publication.
- [ ] 3.6 Update the current published version pointer atomically.
- [ ] 3.7 Record publication metadata and publisher identity.
- [ ] 3.8 Prevent updates to existing published versions.
- [ ] 3.9 Prevent duplicate publication version numbers.
- [ ] 3.10 Handle concurrent publication attempts.
- [ ] 3.11 Implement publication comments.
- [ ] 3.12 Add publication integration tests.

## Phase 4 — Version History and Rollback

- [ ] 4.1 Implement version history retrieval.
- [ ] 4.2 Implement historical version inspection.
- [ ] 4.3 Implement version comparison.
- [ ] 4.4 Implement rollback service.
- [ ] 4.5 Copy selected historical snapshots into new versions.
- [ ] 4.6 Preserve existing drafts during rollback.
- [ ] 4.7 Preserve all existing published versions.
- [ ] 4.8 Record rollback source version and actor.
- [ ] 4.9 Implement transactional rollback.
- [ ] 4.10 Test rollback across multiple publication generations.
- [ ] 4.11 Test rollback failure and concurrency scenarios.

## Phase 5 — Public Documentation API

- [ ] 5.1 Implement public document listing.
- [ ] 5.2 Implement published document retrieval by slug.
- [ ] 5.3 Resolve public content through current published version.
- [ ] 5.4 Exclude documents without published versions.
- [ ] 5.5 Exclude archived documents.
- [ ] 5.6 Implement pagination and filtering.
- [ ] 5.7 Implement safe Markdown rendering.
- [ ] 5.8 Sanitize generated HTML.
- [ ] 5.9 Add public API integration tests.
- [ ] 5.10 Verify draft isolation through direct API tests.

## Phase 6 — Lifecycle and Auditing

- [ ] 6.1 Implement document archiving.
- [ ] 6.2 Implement document restoration.
- [ ] 6.3 Ensure historical versions survive archiving.
- [ ] 6.4 Implement audit event recording.
- [ ] 6.5 Record document creation and draft updates.
- [ ] 6.6 Record publication and rollback.
- [ ] 6.7 Record archive and restoration.
- [ ] 6.8 Implement internal audit history retrieval.
- [ ] 6.9 Add lifecycle and audit tests.

## Phase 7 — Authentication and Security

- [ ] 7.1 Integrate existing JWT authentication middleware.
- [ ] 7.2 Implement writer authorization middleware.
- [ ] 7.3 Protect all internal document endpoints.
- [ ] 7.4 Protect preview and historical version endpoints.
- [ ] 7.5 Verify public routes do not require authentication.
- [ ] 7.6 Verify public responses exclude internal information.
- [ ] 7.7 Test Markdown XSS protection.
- [ ] 7.8 Verify transaction isolation and publication consistency.
- [ ] 7.9 Add security-focused integration tests.

## Phase 8 — Internal Authoring UI

- [ ] 8.1 Create document listing screen.
- [ ] 8.2 Create new document screen.
- [ ] 8.3 Create Markdown editor.
- [ ] 8.4 Implement save draft functionality.
- [ ] 8.5 Implement draft revision conflict handling.
- [ ] 8.6 Implement preview functionality.
- [ ] 8.7 Implement explicit publish confirmation.
- [ ] 8.8 Create publication history screen.
- [ ] 8.9 Implement historical version inspection.
- [ ] 8.10 Implement version comparison.
- [ ] 8.11 Implement rollback confirmation.
- [ ] 8.12 Implement archive and restoration controls.
- [ ] 8.13 Display current publication status.
- [ ] 8.14 Display publication timestamps and publisher details.

## Phase 9 — Quality Assurance and Deployment

- [ ] 9.1 Execute complete unit test suite.
- [ ] 9.2 Execute API integration tests.
- [ ] 9.3 Execute end-to-end publication workflow tests.
- [ ] 9.4 Test multiple concurrent draft updates.
- [ ] 9.5 Test concurrent publishing.
- [ ] 9.6 Test publication rollback and recovery.
- [ ] 9.7 Verify public content isolation.
- [ ] 9.8 Verify historical snapshot immutability.
- [ ] 9.9 Review database indexes and query performance.
- [ ] 9.10 Review API security and authorization.
- [ ] 9.11 Document API contracts.
- [ ] 9.12 Document deployment and migration procedures.
- [ ] 9.13 Prepare production deployment.

## Definition of Done

The implementation is complete when:

- All specification requirements are implemented.
- All database migrations execute successfully.
- All critical unit and integration tests pass.
- Draft content is isolated from published content.
- Publication and rollback are atomic.
- Published versions are immutable.
- Historical publications remain inspectable.
- Public APIs only return eligible published content.
- Authentication and authorization are enforced.
- The internal authoring UI supports the complete authoring lifecycle.