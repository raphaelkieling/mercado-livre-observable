# Mercado Livre Observable

> Pay attention this is a api for a school app, if you wanna this for production create a fork and make a login, security and other things.

| endpoint                          | desc                                       |
|-----------------------------------|--------------------------------------------|
| `[GET] /search?q=itemName`        | Return a list of products on mercado livre |
| `[GET] /item/:id`                 | Return a unique item                       |
| `[GET] [Header] /item`            | Return a list of item                      |
| `[POST] [Header] /save?ids=aa,bb` | Save a list of product ids                 |

## Header

```txt
user_email=<<email_logged_user>>
```

## Contribute

Why? This is a school app