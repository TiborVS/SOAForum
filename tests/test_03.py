from dotenv import load_dotenv
import os
from playwright.sync_api import Page, expect
from datetime import datetime

load_dotenv()

SITE_ROOT = os.environ["SITE_ROOT"]

def test_case_03(page: Page, user_logged_in, second_user_section) -> None:
    """Upravljanje razdelkov
    
    Prijavljen uporabnik lahko ustvarja nove razdelke. Razdelke, ki jih je ustvaril, lahko tudi uredi ali izbriše."""

    page = user_logged_in.new_page()
    page.goto(SITE_ROOT)

    # Koraki glede na dokumentacijo v docs/testni_primeri.md

    # 1A
    page.get_by_role("button", name="Create section").click()

    expect(page.get_by_text("Title cannot be empty!")).to_be_visible()

    # 1B
    page.get_by_role("textbox", name="Title").click()
    page.get_by_role("textbox", name="Title").fill("Fotografija")

    expect(page.get_by_role("textbox", name="Title")).to_have_value("Fotografija")

    # 2B
    page.get_by_role("button", name="Create section").click()

    last_row = page.locator("table tr").nth(-2)

    expect(last_row.get_by_role("link", name="Fotografija")).to_be_visible()
    expect(last_row.get_by_role("cell", name="abc")).to_be_visible()
    expect(last_row.get_by_text(datetime.now().strftime("%d. %m. %Y"))).to_be_visible()
    expect(last_row.get_by_role("button", name="Edit")).to_be_visible()
    expect(last_row.get_by_role("button", name="Delete")).to_be_visible()
    expect(page.get_by_role("textbox", name="Title")).to_be_empty()

    # 3
    last_row.get_by_role("button", name="Edit").click()

    expect(page.get_by_role("textbox", name="Title")).to_have_value("Fotografija")
    expect(page.get_by_role("button", name="Edit section")).to_be_visible()

    # 4A
    page.get_by_role("textbox", name="Title").click()
    page.get_by_role("textbox", name="Title").fill("")

    expect(page.get_by_role("textbox", name="Title")).to_be_empty()

    # 5A
    page.get_by_role("button", name="Edit section").click()

    expect(page.get_by_text("Title cannot be empty!")).to_be_visible()
    expect(last_row.get_by_role("link", name="Fotografija")).to_be_visible()
    
    # 4B
    page.get_by_role("textbox", name="Title").click()
    page.get_by_role("textbox", name="Title").fill("Fotografija")

    expect(page.get_by_role("textbox", name="Title")).to_have_value("Fotografija")

    # 5B
    page.get_by_role("button", name="Edit section").click()

    expect(page.get_by_role("textbox", name="Title")).to_be_empty()
    expect(last_row.get_by_role("link", name="Fotografija")).to_be_visible()

    # 4C
    last_row.get_by_role("button", name="Edit").click()

    expect(page.get_by_role("textbox", name="Title")).to_have_value("Fotografija")
    expect(page.get_by_role("button", name="Edit section")).to_be_visible()

    # 5C
    page.get_by_role("textbox", name="Title").click()
    page.get_by_role("textbox", name="Title").fill("Photography")

    expect(page.get_by_role("textbox", name="Title")).to_have_value("Photography")

    # 6C
    page.get_by_role("button", name="Edit section").click()

    expect(page.get_by_role("textbox", name="Title")).to_be_empty()
    expect(last_row.get_by_role("link", name="Photography")).to_be_visible()

    # 7
    last_row.get_by_role("button", name="Delete").click()

    expect(page.get_by_role("link", name="Photography")).to_have_count(0)

    # 8

    for row in page.locator("table tr").all():
        if row.get_by_text("abc", exact=True).count == 0:
            expect(row.get_by_role("button", name="Edit")).to_have_count(0)
            expect(row.get_by_role("button", name="Delete")).to_have_count(0)
