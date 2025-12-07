from dotenv import load_dotenv
import os
from playwright.sync_api import Page, expect
from datetime import datetime

load_dotenv()

SITE_ROOT = os.environ["SITE_ROOT"]

def test_case_04(page: Page, user_logged_in) -> None:
    """Upravljanje objav
    
    Prijavljen uporabnik lahko ustvarja objave ter svoje objave ureja ali briše.
    """

    page = user_logged_in.new_page()

    page.goto(SITE_ROOT + "/thread/67a3277f09264ca047d15f85")

    # Koraki glede na dokumentacijo v docs/testni_primeri.md

    # 1A
    page.get_by_role("button", name="Post").click()

    expect(page.get_by_text("Post text cannot be empty!")).to_be_visible()

    # 1B
    page.get_by_role("textbox", name="Your thoughts here...").click()
    page.get_by_role("textbox", name="Your thoughts here...").fill("Zdravo!")

    expect(page.get_by_role("textbox", name="Your thoughts here...")).to_have_value("Zdravo!")

    # 2B
    page.get_by_role("button", name="Post").click()

    last_row = page.locator("table tr").last

    expect(last_row.get_by_text("Zdravo!")).to_be_visible()
    expect(last_row.get_by_role("link", name="abc")).to_be_visible()
    expect(last_row.get_by_text(datetime.now().strftime("%d. %m. %Y"))).to_be_visible()
    expect(last_row.get_by_text("Likes: 0 Dislikes: 0")).to_be_visible()
    expect(last_row.get_by_role("button", name="Edit")).to_be_visible()
    expect(last_row.get_by_role("button", name="Delete")).to_be_visible()

    # 3
    last_row.get_by_role("button", name="Edit").click()

    expect(page.get_by_role("textbox", name="Your thoughts here...")).to_have_value("Zdravo!")
    expect(page.locator("#commentbutton")).to_contain_text("Edit")
    expect(page.get_by_role("button", name="Cancel")).to_be_visible()

    # 4A
    page.get_by_role("textbox", name="Your thoughts here...").click()
    page.get_by_role("textbox", name="Your thoughts here...").fill("")

    expect(page.get_by_role("textbox", name="Your thoughts here...")).to_be_empty()

    # 5A
    page.locator("#commentbutton").click()

    expect(page.get_by_text("Post text cannot be empty!")).to_be_visible()
    expect(last_row.get_by_text("Zdravo!")).to_be_visible()

    # 4B
    page.get_by_role("textbox", name="Your thoughts here...").click()
    page.get_by_role("textbox", name="Your thoughts here...").fill("Zdravo!")

    expect(page.get_by_role("textbox", name="Your thoughts here...")).to_have_value("Zdravo!")

    # 5B
    page.locator("#commentbutton").click()

    expect(page.get_by_role("textbox", name="Your thoughts here...")).to_be_empty()
    expect(page.get_by_role("button", name="Choose File")).to_be_visible()
    expect(page.get_by_role("button", name="Post")).to_be_visible()
    expect(last_row.get_by_text("Zdravo!")).to_be_visible()

    # 4C
    last_row.get_by_role("button", name="Edit").click()

    expect(page.get_by_role("textbox", name="Your thoughts here...")).to_have_value("Zdravo!")
    expect(page.locator("#commentbutton")).to_contain_text("Edit")
    expect(page.get_by_role("button", name="Cancel")).to_be_visible()

    # 5C
    page.get_by_role("textbox", name="Your thoughts here...").click()
    page.get_by_role("textbox", name="Your thoughts here...").fill("Kako ste kaj danes :)")

    expect(page.get_by_role("textbox", name="Your thoughts here...")).to_have_value("Kako ste kaj danes :)")

    # 6C
    page.locator("#commentbutton").click()

    expect(page.get_by_role("textbox", name="Your thoughts here...")).to_be_empty()
    expect(page.get_by_role("button", name="Choose File")).to_be_visible()
    expect(page.get_by_role("button", name="Post")).to_be_visible()
    expect(last_row.get_by_text("Kako ste kaj danes :)")).to_be_visible()

    # 7
    last_row.get_by_role("button", name="Delete").click()

    expect(page.get_by_text("Kako ste kaj danes :)")).to_have_count(0)

    # 8
    
    for row in page.locator("table tr").all():
        if row.get_by_text("abc", exact=True).count == 0:
            expect(row.get_by_role("button", name="Edit")).to_have_count(0)
            expect(row.get_by_role("button", name="Delete")).to_have_count(0)
