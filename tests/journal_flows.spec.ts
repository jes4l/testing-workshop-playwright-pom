import { test } from "@playwright/test";
import LandingPage from "./pages/landingPage";
import SignupPage from "./pages/signupPage";
import LoginPage from "./pages/loginPage";
import MyJournalsPage from "./pages/myJournalsPage";
import WriteJournalPage from "./pages/writeJournalPage";
import JournalViewerPage from "./pages/journalViewerPage";
import CommunityPage from "./pages/communityPage";
import content from "./content/journalViewerPage_content";
import * as path from "path";

let sharedEmail = "";

test.describe.serial("Journal Flows", () => {

    test(`Happy Path`, async ({ page }) => {
        test.setTimeout(180000); 

        const landingPage = new LandingPage(page);
        const signupPage = new SignupPage(page);
        const myJournalsPage = new MyJournalsPage(page);
        const writeJournalPage = new WriteJournalPage(page);
        const journalViewerPage = new JournalViewerPage(page);

        await landingPage.goto();
        await landingPage.clickSignupMenu();
        
        sharedEmail = `jesal.vadgama+${Date.now()}@gmail.com`;
        await signupPage.signup('Jesal', 'Vadgama', sharedEmail, 'BlueMoon123!');

        await myJournalsPage.clickWrite();

        await writeJournalPage.addTextBoxAndFill("Having a great day! Testing my Playwright suite with buttons working.");
        
        await writeJournalPage.manipulateTextCanvas();

        const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg'); 
        await writeJournalPage.uploadImage(imagePath);

        await writeJournalPage.manipulateImageCanvas();

        await writeJournalPage.saveJournal();

        await journalViewerPage.openLatestJournal();

        await journalViewerPage.downloadJournal();

        await journalViewerPage.waitForSplatAndAudioToGenerate();

        const stepIntoBtn = page.getByRole('button', { name: content.stepIntoJournalRegex });
        await stepIntoBtn.click();

        await journalViewerPage.waitForSplatToLoadInViewer();

        await journalViewerPage.playAudioFor(2);

        const closeBtn = page.locator('.btn-close-splat');
        await closeBtn.click();

        await page.waitForTimeout(500);
    });

    test(`Unhappy Path`, async ({ page }) => {
        test.setTimeout(180000);

        const landingPage = new LandingPage(page);
        const loginPage = new LoginPage(page);
        const writeJournalPage = new WriteJournalPage(page);
        const journalViewerPage = new JournalViewerPage(page);
        const communityPage = new CommunityPage(page);

        await landingPage.goto();
        await landingPage.clickLoginMenu();
        await loginPage.login(sharedEmail, 'BlueMoon123!');

        await journalViewerPage.openLatestJournal();

        await journalViewerPage.clickEditToday();

        await writeJournalPage.editExistingText("i have had an awful day because im testing the unhappy path");

        await writeJournalPage.saveJournal();

        await journalViewerPage.openLatestJournal();

        await journalViewerPage.clickEditToday();

        const imagePath2 = path.join(__dirname, 'fixtures', 'test-image2.jpg'); 
        await writeJournalPage.uploadImage(imagePath2);

        await page.getByRole('link', { name: 'My Journals' }).click();

        await page.waitForURL(/.*\/entries/);

        await journalViewerPage.openLatestJournal();

        await journalViewerPage.postImageToCommunity();

        await page.getByRole('link', { name: 'Community Gallery' }).click();

        await communityPage.verifyPostedImage();

        await communityPage.clickLatestPost();
        
        await page.waitForTimeout(500);
    });

});