from .supabase_client import supabase

def save_leads(leads):

    data = []

    for lead in leads:

        try:

            row = {
                "business_name": lead.get("title"),
                "category": lead.get("category"),
                "website": lead.get("website"),
                "email": lead.get("email"),
                "phone": lead.get("phone"),
                "address": lead.get("address"),

                "rating": None
                if lead.get("rating") in ["nil", "", None]
                else float(lead["rating"]),

                "reviews_count": None
                if lead.get("reviews_count") in ["nil", "", None]
                else int(
                    str(
                        lead["reviews_count"]
                    ).replace(",", "")
                ),

                "business_size": lead.get("business_size"),

                "lead_score": int(
                    lead.get("lead_score", 0)
                ),

                "lead_grade": lead.get("lead_grade"),

                "opportunity_signals":
                    lead.get("opportunity_signals"),

                "score_breakdown":
                    lead.get("score_breakdown"),
            }

            data.append(row)

        except Exception as e:

            print(
                "ROW BUILD ERROR:",
                e
            )

    print(
        f"\nATTEMPTING TO INSERT {len(data)} LEADS\n"
    )

    try:

        result = (
            supabase
    .table("leads")
    .upsert(
        data,
        on_conflict="business_name,phone"
    )
    .execute()
        )

        print("\nINSERT SUCCESS\n")
        print(result)

        return result

    except Exception as e:

        print("\nINSERT FAILED\n")
        print(e)

        raise