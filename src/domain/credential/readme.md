# Credential

Contains the domain concepts and rules related to authentication credentials.

A credential represents the information or mechanism used to prove
the ownership of an Identity.

Examples:
- Password
- Password hash
- MFA credential
- Recovery credential
- External authentication credential

Responsibilities:
- Define credential-related domain concepts
- Define credential business rules
- Represent the relationship between credentials and Identity

This layer must not depend on HTTP, NestJS, TypeORM, PostgreSQL,
Redis or other infrastructure technologies.