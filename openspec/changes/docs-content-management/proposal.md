# Change: Docs Content Management

## Summary

Build Northbeam Docs Studio, an internal documentation content-management service that allows authorized writers to create, edit, preview, publish, and manage documentation articles.

The public documentation website must only expose published content.

The system must guarantee that editing a draft cannot modify published content. Every publication must create an immutable, independently inspectable snapshot. Writers must be able to inspect historical publications and restore a previous publication without destroying intervening history.

## Problem Statement

Northbeam needs a lightweight content service with two distinct audiences:

1. Internal writers who create and maintain documentation.
2. Public readers who consume published documentation.

A conventional CMS that stores drafts and published content in the same mutable record introduces risks:

- Editing an article can unintentionally affect live documentation.
- Publishing can destroy the previous live content.
- Accidental publications are difficult to reverse.
- Historical content cannot be reliably inspected or recovered.

The proposed architecture separates editable drafts from immutable published versions.

## Goals

- Provide authenticated writer access.
- Create, edit, save, and preview documentation articles.
- Support Markdown-based content authoring.
- Maintain a stable document identity and URL slug.
- Publish articles through an explicit operation.
- Create immutable snapshots on every successful publication.
- Maintain complete publication history.
- Restore previously published content safely.
- Expose only currently published content through public APIs.
- Maintain an audit trail of important operations.
- Provide optimistic concurrency protection against conflicting edits.

## Non-Goals

- Multi-tenant content management.
- Collaborative real-time editing.
- Comments and editorial review workflows.
- Complex approval chains.
- Localization and multilingual publishing.
- Rich text WYSIWYG editor.
- Public user registration.
- Search engine infrastructure beyond basic document listing and filtering.

## Proposed Solution

### Content separation

A document represents a stable identity, not the published content itself.

Each document has:
- One editable draft.
- Zero or more immutable published versions.
- A pointer to its current published version.
- Publication history.

### Publishing

When a writer publishes:

1. Validate the draft.
2. Verify the writer's authorization.
3. Start a database transaction.
4. Create an immutable document version containing a complete content snapshot.
5. Record the publication event.
6. Update the document's current published version pointer.
7. Mark the document as published.
8. Commit the transaction.

A failed operation must leave the existing live publication unchanged.

### Rollback

A writer can select any previous published version.

The rollback operation creates a new published version containing the selected historical snapshot. It must not modify or delete existing versions.

### Public delivery

The public API reads only the document's current published version.

Unpublished documents, draft content, and historical versions must not be exposed through public endpoints.

## Technical Decisions

- Runtime: Node.js
- Framework: Express.js
- ORM: Sequelize v6
- Database: PostgreSQL
- Authentication: JWT
- Content format: Markdown stored as PostgreSQL TEXT
- Metadata: PostgreSQL JSONB
- Identifiers: UUID
- Timestamps: TIMESTAMPTZ
- API style: REST
- Application scope: Single application

## Security

- All writer endpoints require authentication.
- Administrative operations require appropriate authorization.
- Public endpoints must never return draft data.
- Historical content must be accessible only to authorized internal users.
- Markdown rendering must be protected against XSS.
- All publishing and rollback operations must be transactionally consistent.
- Important operations must be recorded in audit logs.

## Success Criteria

- Draft modifications never affect published content.
- Each successful publication produces a distinct immutable version.
- Every published version can be inspected.
- Rollback restores previous content by creating a new version.
- Public endpoints never expose unpublished content.
- Concurrent draft updates cannot silently overwrite one another.
- Failed publication operations never replace live content.
- All critical operations have automated tests.

## Dependencies

- Existing authentication and authorization infrastructure.
- PostgreSQL database.
- Sequelize migrations and model associations.
- Markdown parsing and safe HTML rendering library.

## Risks

| Risk | Mitigation |
|---|---|
| Accidental publication | Explicit publish operation and preview |
| Historical content corruption | Immutable version records and restricted database writes |
| Concurrent updates | Optimistic locking |
| XSS through Markdown | Sanitized HTML rendering |
| Failed publication | Database transaction |
| Incorrect rollback | New version generated from historical snapshot |
| Unauthorized draft access | JWT middleware and authorization checks |

## Rollout

1. Implement database schema and migrations.
2. Implement content-management services.
3. Implement publishing and rollback.
4. Implement public read-only APIs.
5. Implement internal authoring UI.
6. Run security and integration tests.
7. Deploy behind authenticated writer access.

## Acceptance

The change is complete when all requirements in the associated specification are implemented and all tasks in the implementation checklist are verified.