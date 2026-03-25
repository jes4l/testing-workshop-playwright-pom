import { test } from "@playwright/test";
import LandingPage from "./pages/landingPage";
import SignupPage from "./pages/signupPage";
import MyJournalsPage from "./pages/myJournalsPage";
import WriteJournalPage from "./pages/writeJournalPage";
import JournalViewerPage from "./pages/journalViewerPage";
import * as path from "path";

test(`Happy Path - Complete Journal Flow with Audio`, async ({ page }) => {
    const landingPage = new LandingPage(page);
    const signupPage = new SignupPage(page);
    const myJournalsPage = new MyJournalsPage(page);
    const writeJournalPage = new WriteJournalPage(page);
    const journalViewerPage = new JournalViewerPage(page);

    // 1. Landing & Sign Up
    await landingPage.goto();
    await landingPage.clickSignupMenu();
    
    const uniqueEmail = `jesal.vadgama+${Date.now()}@gmail.com`;
    await signupPage.signup('Jesal', 'Vadgama', uniqueEmail, 'BlueMoon123!');

    // 2. Navigate to Write
    await myJournalsPage.clickWrite();

    // 3. Write Journal
    await writeJournalPage.addTextBoxAndFill("Having a great day! Testing my Playwright suite with a brand new account and audio playback.");
    
    // 4. Upload Image from fixtures
    const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg'); 
    await writeJournalPage.uploadImage(imagePath);

    // 5. Save Journal
    await writeJournalPage.saveJournal();

    // 6. View the newly created journal
    await journalViewerPage.openLatestJournal();

    // 7. Wait 30 seconds for background ML and Transcript jobs to finish
    // This allows the "Step into Journal" button and Audio player to appear
    await page.waitForTimeout(30000);
    await page.reload(); // Reload to see the generated buttons

    // 8. Step into the Journal (Gaussian Splat View)
    const stepIntoBtn = page.getByRole('button', { name: /Step into Journal/i });
    await stepIntoBtn.click();

    // 9. Play the Audio
    const playBtn = page.locator('button[aria-label="Play Audio"]');
    await playBtn.click();

    // 10. Listen for 5 seconds
    await page.waitForTimeout(5000);

    // 11. Close the 3D Overlay
    const closeBtn = page.locator('.btn-close-splat');
    await closeBtn.click();

    // 12. Final verification: Check we are back on the journal page
    await journalViewerPage.postImageToCommunity();
});