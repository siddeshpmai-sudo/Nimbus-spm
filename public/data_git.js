window.interviewData = window.interviewData || {};

window.interviewData["Git"] = {
  "Basic": [
    { 
      q: "What is Git?", 
      a: "<strong>Detailed Solution:</strong> Git is a distributed version control system (DVCS).<br><ul><li><strong>Function:</strong> It tracks changes in any set of files, usually used for coordinating work among programmers collaboratively developing source code.</li><li><strong>Distributed:</strong> Unlike centralized systems (like SVN), every developer has a full, local copy of the entire repository history, meaning they can commit and branch completely offline.</li></ul>" 
    },
    { 
      q: "What is the difference between Git and GitHub?", 
      a: "<strong>Detailed Solution:</strong> They are fundamentally different tools.<br><ul><li><strong>Git:</strong> The underlying command-line software running on your local machine that actually manages versions and tracks changes.</li><li><strong>GitHub:</strong> A commercial cloud-based hosting service that holds remote Git repositories and provides a web interface, CI/CD, and collaboration tools like Pull Requests.</li></ul>" 
    },
    { 
      q: "What does 'git clone' do?", 
      a: "<strong>Detailed Solution:</strong> It downloads a remote repository to your local machine.<br><ul><li><strong>Function:</strong> It copies all files, branches, and the entire commit history into a new local directory.</li><li><strong>Link:</strong> It automatically sets up a remote tracking connection called 'origin', linking your local copy back to the source URL so you can easily pull/push future changes.</li></ul>" 
    },
    { 
      q: "What is a detached HEAD state?", 
      a: "<strong>Detailed Solution:</strong> The HEAD is a pointer indicating your current position in the Git history.<br><ul><li><strong>Normal State:</strong> HEAD points to a branch name (like 'main'), which then points to the latest commit.</li><li><strong>Detached State:</strong> You ran <code>git checkout &lt;commit-hash&gt;</code> instead of a branch. HEAD now points directly to a commit. Any new commits made here will be orphaned and lost when you switch branches because no branch is tracking them.</li></ul>" 
    },
    { 
      q: "What is the difference between 'git pull' and 'git fetch'?", 
      a: "<strong>Detailed Solution:</strong> They both retrieve data from the remote, but handle local changes differently.<br><ul><li><strong>git fetch:</strong> Safely downloads new commits and branches from the remote repository to your local machine, but <em>does not</em> integrate them into your working files.</li><li><strong>git pull:</strong> Does a <code>git fetch</code> followed immediately by a <code>git merge</code> (or rebase), actively altering your current working directory to integrate the newly downloaded changes.</li></ul>" 
    },
    { 
      q: "How do you resolve a merge conflict?", 
      a: "<strong>Detailed Solution:</strong> Conflicts happen when two branches modify the exact same lines of code.<br><ul><li><strong>Step 1:</strong> Git pauses the merge and modifies the affected files, adding conflict markers (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>).</li><li><strong>Step 2:</strong> Open the file, decide which code to keep, and manually delete the conflict markers.</li><li><strong>Step 3:</strong> Run <code>git add &lt;file&gt;</code> to mark it as resolved, then run <code>git commit</code> to finalize the merge.</li></ul>" 
    },
    { 
      q: "What is 'git stash'?", 
      a: "<strong>Detailed Solution:</strong> It is a clipboard for incomplete work.<br><ul><li><strong>Function:</strong> It temporarily shelves (saves) uncommitted changes in your working directory and index, reverting your workspace to the state of the last commit (HEAD).</li><li><strong>Usage:</strong> Useful when you need to quickly switch branches to fix a bug but aren't ready to commit your current half-finished work. Retrieve it later with <code>git stash pop</code>.</li></ul>" 
    },
    { 
      q: "How do you view commit history?", 
      a: "<strong>Detailed Solution:</strong> Use the log command.<br><ul><li><strong>Command:</strong> <code>git log</code> shows the full history with author, date, and message.</li><li><strong>Useful Flags:</strong> <code>git log --oneline</code> shows a condensed view. <code>git log --graph</code> draws a visual ASCII tree of branching and merging.</li></ul>" 
    },
    { 
      q: "What is a .gitignore file?", 
      a: "<strong>Detailed Solution:</strong> It tells Git which files it should never track.<br><ul><li><strong>Function:</strong> A plain text file containing patterns of filenames or directories (like `node_modules/`, `*.log`, or `.env`).</li><li><strong>Importance:</strong> Prevents accidental commits of massive compiled binaries, temporary IDE files, or sensitive security credentials.</li></ul>" 
    },
    { 
      q: "How do you undo the last local commit?", 
      a: "<strong>Detailed Solution:</strong> Use the <code>git reset</code> command.<br><ul><li><strong>Keep changes:</strong> <code>git reset --soft HEAD~1</code> destroys the commit but leaves all the files modified in your working directory so you can edit and commit again.</li><li><strong>Destroy changes:</strong> <code>git reset --hard HEAD~1</code> destroys the commit AND wipes out the file modifications permanently.</li></ul>" 
    }
  ],
  "Scenario Based": [
    { 
      q: "Scenario: You committed sensitive data (like a password) to a remote repo. How do you fix it?", 
      a: "<strong>Detailed Solution:</strong> Simply deleting the file in a new commit is NOT enough, as the password remains in the Git history forever.<br><ul><li><strong>Step 1:</strong> You must rewrite the entire Git history to purge the file. Use a tool like <strong>BFG Repo-Cleaner</strong> (<code>bfg --delete-files password.txt</code>) or <code>git filter-branch</code>.</li><li><strong>Step 2:</strong> Forcefully push to the remote repository using <code>git push origin --force</code> to overwrite the cloud history.</li><li><strong>Step 3:</strong> Communication is critical. Inform your team to delete their local clones and re-clone the repository, otherwise their corrupted local histories will cause massive conflicts.</li></ul>" 
    },
    { 
      q: "Scenario: You accidentally pushed a bad commit to the remote 'main' branch. Other developers have already pulled it. How do you undo it safely?", 
      a: "<strong>Detailed Solution:</strong> Since others have pulled, rewriting history using `git reset` is highly destructive and forbidden on shared branches.<br><ul><li><strong>Solution:</strong> Use <code>git revert &lt;commit-hash&gt;</code>.</li><li><strong>Explanation:</strong> <code>git revert</code> creates a brand-new commit that applies the exact inverse (opposite) changes of the bad commit. This moves the project history safely forward while removing the buggy code. Others can simply <code>git pull</code> normally without history mismatch issues.</li></ul>" 
    },
    { 
      q: "Scenario: You made 5 small local commits on your feature branch, but you want them to be a single commit before opening a Pull Request.", 
      a: "<strong>Detailed Solution:</strong> Having 'WIP' (Work in Progress) commits clutters the project history. You should squash them.<br><ul><li><strong>Command:</strong> Run an interactive rebase: <code>git rebase -i HEAD~5</code>.</li><li><strong>Process:</strong> A text editor opens listing the 5 commits. Leave the word <code>pick</code> next to the top (oldest) commit. Change <code>pick</code> to <code>squash</code> (or <code>s</code>) for the other 4.</li><li><strong>Finalizing:</strong> Save and close. Git will combine them and prompt you to write a new, unified commit message.</li></ul>" 
    },
    { 
      q: "Scenario: You started working on 'main' by mistake instead of a new branch. You haven't committed yet. How do you move work to a new branch?", 
      a: "<strong>Detailed Solution:</strong> Git handles this seamlessly because uncommitted changes are not yet permanently attached to the branch.<br><ul><li><strong>Solution:</strong> Run <code>git checkout -b my-new-feature-branch</code>.</li><li><strong>Explanation:</strong> Switching branches carries over all uncommitted modifications (staged or unstaged) in your working directory. You can now run <code>git commit</code> safely on the new branch, leaving 'main' untouched.</li></ul>" 
    },
    { 
      q: "Scenario: A developer pushed code, but it says 'non-fast-forward' when you try to push.", 
      a: "<strong>Detailed Solution:</strong> This error means the remote repository contains commits that you do not have locally, so Git refuses to overwrite them.<br><ul><li><strong>Solution 1 (Merge):</strong> Run <code>git pull</code>. This fetches their changes and creates a 'merge commit' combining your work with theirs. You can then push.</li><li><strong>Solution 2 (Rebase - Preferred):</strong> Run <code>git pull --rebase</code>. This rewinds your local commits, applies their changes, and then replays your commits on top, resulting in a cleaner, linear history.</li></ul>" 
    },
    { 
      q: "Scenario: You need to find which commit introduced a bug.", 
      a: "<strong>Detailed Solution:</strong> Use the built-in binary search tool.<br><ul><li><strong>Command:</strong> Start with <code>git bisect start</code>.</li><li><strong>Process:</strong> Mark the current broken state: <code>git bisect bad</code>. Mark an older commit where it worked: <code>git bisect good &lt;old-hash&gt;</code>.</li><li><strong>Execution:</strong> Git will automatically checkout a commit exactly halfway between them. You test the code and reply with <code>git bisect good</code> or <code>bad</code>. Git continues slicing the history in half until it pinpoints the exact offending commit in seconds.</li></ul>" 
    },
    { 
      q: "Scenario: You want to see who wrote a specific line of code in a file.", 
      a: "<strong>Detailed Solution:</strong> Use the blame command.<br><ul><li><strong>Command:</strong> <code>git blame &lt;filename&gt;</code></li><li><strong>Explanation:</strong> This outputs the entire file, annotating every single line with the commit hash, the author's name, and the timestamp of when that specific line was last modified. Useful for finding who to ask about a piece of confusing logic.</li></ul>" 
    },
    { 
      q: "Scenario: You want to discard all uncommitted changes in your working directory and reset to the last commit.", 
      a: "<strong>Detailed Solution:</strong> You need two commands to completely wipe the slate clean.<br><ul><li><strong>Tracked Files:</strong> Run <code>git reset --hard HEAD</code>. This forces all tracked files back to their exact state at the last commit.</li><li><strong>Untracked Files:</strong> Run <code>git clean -fd</code>. The <code>-f</code> forces deletion and <code>-d</code> includes untracked directories. This deletes any brand new files you created that Git doesn't know about yet.</li></ul>" 
    },
    { 
      q: "Scenario: You need a bugfix from main without merging all of main into your branch.", 
      a: "<strong>Detailed Solution:</strong> Use the cherry-pick command to isolate a single commit.<br><ul><li><strong>Command:</strong> <code>git cherry-pick &lt;commit-hash&gt;</code></li><li><strong>Explanation:</strong> While on your feature branch, this command grabs the exact changes introduced by that specific commit hash on `main` and applies them to your current branch as a new commit. It ignores all other commits surrounding it on `main`.</li></ul>" 
    },
    { 
      q: "Scenario: You deleted a branch locally, but it still shows in 'git branch -a' list under remotes.", 
      a: "<strong>Detailed Solution:</strong> Your local git cache is out of sync with the server.<br><ul><li><strong>Command:</strong> Run <code>git fetch --prune</code> (or <code>git fetch -p</code>).</li><li><strong>Explanation:</strong> This connects to the remote, realizes the remote branch was deleted, and safely deletes the local 'remote-tracking' reference (e.g., <code>origin/deleted-branch</code>) from your cache.</li></ul>" 
    },
    { 
      q: "Scenario: You need to rename a local branch.", 
      a: "<strong>Detailed Solution:</strong> Use the branch move flag.<br><ul><li><strong>Local:</strong> While on the branch, run <code>git branch -m new-name</code>.</li><li><strong>Remote Sync:</strong> If the old branch was already pushed, you must push the new one: <code>git push origin -u new-name</code>. Then delete the old one from the remote: <code>git push origin --delete old-name</code>.</li></ul>" 
    },
    { 
      q: "Scenario: You made a typo in the commit message of the very last commit.", 
      a: "<strong>Detailed Solution:</strong> Use the amend flag.<br><ul><li><strong>Command:</strong> <code>git commit --amend -m 'Corrected new message'</code></li><li><strong>Warning:</strong> This actually alters the commit hash. It is perfectly safe if the commit is local. However, if you have already pushed to a remote, you will have to <code>git push --force</code>, which is dangerous if others have pulled.</li></ul>" 
    },
    { 
      q: "Scenario: Save uncommitted work, switch branches to fix a critical bug, then restore it.", 
      a: "<strong>Detailed Solution:</strong> Use the stash functionality.<br><ul><li><strong>Step 1:</strong> <code>git stash</code> (Your working directory is now clean).</li><li><strong>Step 2:</strong> <code>git checkout hotfix-branch</code> (Do your work, commit, push).</li><li><strong>Step 3:</strong> <code>git checkout feature-branch</code> (Go back to where you were).</li><li><strong>Step 4:</strong> <code>git stash pop</code> (Re-applies your saved uncommitted work and removes it from the stash list).</li></ul>" 
    },
    { 
      q: "Scenario: You want to list all files changed in a specific past commit.", 
      a: "<strong>Detailed Solution:</strong> Use the show command with the name-only flag.<br><ul><li><strong>Command:</strong> <code>git show --name-only &lt;commit-hash&gt;</code></li><li><strong>Explanation:</strong> By default, <code>git show</code> outputs the massive diff of the commit. Adding <code>--name-only</code> suppresses the diff and just lists the filenames that were added, modified, or deleted.</li></ul>" 
    },
    { 
      q: "Scenario: A repository is 10GB in size with 10 years of history. How do you clone it faster?", 
      a: "<strong>Detailed Solution:</strong> Perform a shallow clone.<br><ul><li><strong>Command:</strong> <code>git clone --depth 1 &lt;repository-url&gt;</code></li><li><strong>Explanation:</strong> This only fetches the files exactly as they exist at the very latest commit on the default branch. It skips downloading the 10 years of historical diffs, turning a 10GB download into a 50MB download. Ideal for CI/CD pipelines.</li></ul>" 
    },
    { 
      q: "Scenario: Check which branches currently contain a specific commit.", 
      a: "<strong>Detailed Solution:</strong> Use the branch contains flag.<br><ul><li><strong>Command:</strong> <code>git branch --contains &lt;commit-hash&gt;</code></li><li><strong>Explanation:</strong> This iterates through your local branches and lists only the ones where that specific commit exists in their history. Useful for verifying if a bugfix has been merged into a specific release branch.</li></ul>" 
    },
    { 
      q: "Scenario: You accidentally committed a file, you want to remove it from Git, but keep it on your hard drive.", 
      a: "<strong>Detailed Solution:</strong> Use the remove cached command.<br><ul><li><strong>Command:</strong> <code>git rm --cached &lt;filename&gt;</code></li><li><strong>Explanation:</strong> This deletes the file from Git's tracking index (so it will be deleted from the repository on the next commit), but leaves the physical file untouched on your local disk. Always remember to add the filename to <code>.gitignore</code> immediately after.</li></ul>" 
    },
    { 
      q: "Scenario: You forked an open-source project. How do you sync your fork with the original upstream repository?", 
      a: "<strong>Detailed Solution:</strong> You must configure a second remote connection.<br><ul><li><strong>Step 1:</strong> <code>git remote add upstream &lt;original-repo-url&gt;</code></li><li><strong>Step 2:</strong> <code>git fetch upstream</code> (downloads original changes).</li><li><strong>Step 3:</strong> Make sure you are on main: <code>git checkout main</code>.</li><li><strong>Step 4:</strong> <code>git merge upstream/main</code> or <code>git rebase upstream/main</code> to integrate the original author's changes into your local fork.</li></ul>" 
    },
    { 
      q: "Scenario: Find a deleted file's history so you can restore it.", 
      a: "<strong>Detailed Solution:</strong> You must search the history for the deletion event.<br><ul><li><strong>Step 1:</strong> Run <code>git log --all -- &lt;deleted-filename&gt;</code>. This lists the history of that file. Find the commit hash where it was deleted.</li><li><strong>Step 2:</strong> To get it back, checkout the commit <em>just before</em> it was deleted. Use the caret (^) symbol: <code>git checkout &lt;commit-hash&gt;^ -- &lt;deleted-filename&gt;</code>.</li></ul>" 
    },
    { 
      q: "Scenario: Force Git to temporarily ignore local modifications to a tracked config file.", 
      a: "<strong>Detailed Solution:</strong> You cannot use .gitignore for files already tracked. Use update-index.<br><ul><li><strong>Command:</strong> <code>git update-index --assume-unchanged config.yml</code></li><li><strong>Explanation:</strong> This tells Git to stop checking this file for modifications. You can safely alter it with local database passwords without fear of accidentally committing it. To reverse it, use <code>--no-assume-unchanged</code>.</li></ul>" 
    }
  ],
  "Advance Scenario": [
    { 
      q: "Scenario: Your feature branch diverged from main 3 months ago. A standard merge causes massive conflicts. How do you approach this?", 
      a: "<strong>Detailed Solution:</strong> Resolving 3 months of conflicts in a single massive merge is highly error-prone.<br><ul><li><strong>Approach 1 (Incremental Rebase):</strong> Use <code>git rebase -i main</code>. When conflicts occur, Git pauses. Fix the specific file, <code>git add</code>, and <code>git rebase --continue</code>. You resolve conflicts one commit at a time, making it easier to track logic breaks.</li><li><strong>Approach 2 (Reverse Merge):</strong> Next time, practice Continuous Integration. Periodically merge <code>main</code> into your feature branch (e.g., weekly). By keeping your branch up to date incrementally, you avoid 'integration hell'.</li></ul>" 
    },
    { 
      q: "Scenario: Move a specific subdirectory of a huge repository into a new standalone repository while keeping its commit history.", 
      a: "<strong>Detailed Solution:</strong> Standard copy-paste loses history. You must slice the repo.<br><ul><li><strong>Command:</strong> Run <code>git subtree split --prefix=&lt;folder&gt; -b new-branch</code>. This creates a new branch containing ONLY the commits that touched that folder.</li><li><strong>Extraction:</strong> Create a new empty repository. From inside the new repo, run <code>git pull /path/to/old/repo new-branch</code>. Push the new repo to a remote.</li><li><strong>Note:</strong> Modern teams prefer using the open-source <code>git filter-repo</code> tool for this, as it is significantly faster and cleaner.</li></ul>" 
    },
    { 
      q: "Scenario: You accidentally ran `git reset --hard HEAD~5` and completely lost 5 unpushed commits. How do you recover them?", 
      a: "<strong>Detailed Solution:</strong> Git almost never deletes data immediately. You can recover it using the reflog.<br><ul><li><strong>Step 1:</strong> Run <code>git reflog</code>. This is a local-only diary of every time the HEAD pointer moved, regardless of branches.</li><li><strong>Step 2:</strong> Scan the list to find the SHA hash of the commit just before you ran the reset command.</li><li><strong>Step 3:</strong> Restore it using <code>git reset --hard &lt;SHA&gt;</code> or branch off it using <code>git checkout -b recovered-branch &lt;SHA&gt;</code>.</li></ul>" 
    },
    { 
      q: "Scenario: You want to automate a code linting script to run every time a developer types 'git commit' locally.", 
      a: "<strong>Detailed Solution:</strong> Utilize Git Hooks.<br><ul><li><strong>Implementation:</strong> Navigate to the hidden <code>.git/hooks/</code> directory in the repository. Create an executable file named exactly <code>pre-commit</code> (no extension).</li><li><strong>Function:</strong> Write your bash/python linting logic in this file. If the script exits with a non-zero status (e.g., linting fails), Git will immediately abort the commit process, forcing the developer to fix the code before committing.</li></ul>" 
    },
    { 
      q: "Scenario: A feature requires a submodule to a third-party library, but you need to lock it to a very specific commit hash, not just 'main'.", 
      a: "<strong>Detailed Solution:</strong> Submodules point to commits, not branches.<br><ul><li><strong>Step 1:</strong> Add the submodule: <code>git submodule add &lt;url&gt;</code>.</li><li><strong>Step 2:</strong> CD into the new submodule directory. It operates as an independent Git repo. Run <code>git checkout &lt;specific-hash&gt;</code>.</li><li><strong>Step 3:</strong> CD back up to your parent repository. Run <code>git add &lt;submodule-folder&gt;</code> and <code>git commit</code>. The parent repo now permanently locks that specific submodule hash to this commit.</li></ul>" 
    },
    { 
      q: "Scenario: You need to merge two completely unrelated repositories together into one.", 
      a: "<strong>Detailed Solution:</strong> Git will aggressively block this to prevent mistakes, so you must override it.<br><ul><li><strong>Step 1:</strong> In Repo A, add Repo B as a remote: <code>git remote add repoB &lt;url&gt;</code>.</li><li><strong>Step 2:</strong> Fetch the data: <code>git fetch repoB</code>.</li><li><strong>Step 3:</strong> Force the merge using a special flag: <code>git merge repoB/main --allow-unrelated-histories</code>. Git will merge the two distinct commit trees into one.</li></ul>" 
    },
    { 
      q: "Scenario: Find a specific string or variable that was added or removed anywhere in the entire Git history.", 
      a: "<strong>Detailed Solution:</strong> Use the pickaxe search.<br><ul><li><strong>Command:</strong> <code>git log -S \"SecretApiKey123\"</code></li><li><strong>Explanation:</strong> This searches through every diff of every commit. It will only output the commits where the number of occurrences of that exact string changed (i.e., when it was added or deleted). Highly useful for security audits.</li></ul>" 
    },
    { 
      q: "Scenario: Your company requires proof that commits actually came from you to prevent impersonation.", 
      a: "<strong>Detailed Solution:</strong> Implement cryptographic commit signing.<br><ul><li><strong>Setup:</strong> Generate a GPG key pair locally. Add the public GPG key to your GitHub/GitLab account settings. Tell Git your key ID using <code>git config user.signingkey &lt;KEY_ID&gt;</code>.</li><li><strong>Execution:</strong> Add the <code>-S</code> flag when committing: <code>git commit -S -m \"Message\"</code>. Sites like GitHub will now display a green \"Verified\" badge next to your commits.</li></ul>" 
    },
    { 
      q: "Scenario: Squash the last 10 commits without using the interactive rebase UI.", 
      a: "<strong>Detailed Solution:</strong> You can do this quickly using a soft reset.<br><ul><li><strong>Command 1:</strong> <code>git reset --soft HEAD~10</code>. This destroys the last 10 commits but leaves all their file modifications staged in the index.</li><li><strong>Command 2:</strong> <code>git commit -m \"Combined squash message\"</code>. This creates a brand new single commit containing all the changes from those 10 commits.</li></ul>" 
    },
    { 
      q: "Scenario: You accidentally dropped a stash using `git stash drop` and need to recover the changes.", 
      a: "<strong>Detailed Solution:</strong> Dropped stashes become unreachable objects, but they are not immediately deleted from the disk garbage collector.<br><ul><li><strong>Command 1:</strong> Run <code>git fsck --unreachable | grep commit</code> to find all unreachable commit hashes.</li><li><strong>Command 2:</strong> Use <code>git show &lt;hash&gt;</code> to inspect them until you find the one matching your lost stash.</li><li><strong>Command 3:</strong> Run <code>git merge &lt;hash&gt;</code> or <code>git checkout -b recovered-stash &lt;hash&gt;</code> to retrieve the work.</li></ul>" 
    }
  ]
};
