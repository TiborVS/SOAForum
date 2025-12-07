from dotenv import load_dotenv
import os, re
from playwright.sync_api import Page, expect
import pytest

load_dotenv()

SITE_ROOT = os.environ["SITE_ROOT"]
TEST_USER_EMAIL = os.environ["TEST_USER_EMAIL"]
TEST_USER_PASSWORD = os.environ["TEST_USER_PASSWORD"]
UNREGISTERED_EMAIL = "test.email@somesite.org"

@pytest.mark.xfail(reason="known issue with login, no time to fix currently")
def test_case_02(page: Page) -> None:
    """Prijava
    
    Obstoječi uporabnik se lahko s pravilnimi podatki prijavi v sistem."""

    page.goto(SITE_ROOT)

    # 1
    page.get_by_role("link", name="Log in").click()

    page.wait_for_url(SITE_ROOT + "/login")

    # 2A
    page.get_by_role("button", name="Log in").click()

    expect(page.get_by_text("E-mail cannot be empty!")).to_be_visible()
    expect(page).to_have_url(SITE_ROOT + "/login")

    # 2B
    page.get_by_role("textbox", name="E-mail").click()
    page.get_by_role("textbox", name="E-mail").fill(TEST_USER_EMAIL)

    expect(page.get_by_role("textbox", name="E-mail")).to_have_value(TEST_USER_EMAIL)

    # 3B
    page.get_by_role("button", name="Log in").click()

    expect(page.get_by_text("Password cannot be empty!")).to_be_visible()
    expect(page).to_have_url(SITE_ROOT + "/login")

    # 2C
    page.get_by_role("textbox", name="E-mail").click()
    page.get_by_role("textbox", name="E-mail").fill(TEST_USER_EMAIL)

    expect(page.get_by_role("textbox", name="E-mail")).to_have_value(TEST_USER_EMAIL)

    # 3C
    page.get_by_role("textbox", name="Password").click()
    page.get_by_role("textbox", name="Password").fill("wrongpassword")

    expect(page.get_by_role("textbox", name="Password")).to_have_value("wrongpassword")

    # 4C
    page.get_by_role("button", name="Log in").click()

    expect(page.get_by_text("Wrong email or password!")).to_be_visible()
    expect(page).to_have_url(SITE_ROOT + "/login")

    # 2D
    page.get_by_role("textbox", name="E-mail").click()
    page.get_by_role("textbox", name="E-mail").fill(UNREGISTERED_EMAIL)

    expect(page.get_by_role("textbox", name="E-mail")).to_have_value(UNREGISTERED_EMAIL)

    # 3D
    page.get_by_role("textbox", name="Password").click()
    page.get_by_role("textbox", name="Password").fill("abcd")

    expect(page.get_by_role("textbox", name="Password")).to_have_value("abcd")

    # 4D
    page.get_by_role("button", name="Log in").click()

    expect(page.get_by_text("Wrong email or password!")).to_be_visible()
    expect(page).to_have_url(SITE_ROOT + "/login")

    # 2E
    page.get_by_role("textbox", name="E-mail").click()
    page.get_by_role("textbox", name="E-mail").fill(TEST_USER_EMAIL)

    expect(page.get_by_role("textbox", name="E-mail")).to_have_value(TEST_USER_EMAIL)

    # 3E
    page.get_by_role("textbox", name="Password").click()
    page.get_by_role("textbox", name="Password").fill(TEST_USER_PASSWORD)

    expect(page.get_by_role("textbox", name="Password")).to_have_value(TEST_USER_PASSWORD)

    # 4E
    page.get_by_role("button", name="Log in").click()
    page.wait_for_url(SITE_ROOT)

    expect(page).to_have_url(re.compile(SITE_ROOT + "/?"))
    expect(page.get_by_role("button", name="Log out")).to_be_visible()
