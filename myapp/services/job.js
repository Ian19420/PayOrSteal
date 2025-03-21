const jobs = {
    銀行家: { bankBalance: 10000,reputation: 80, policeAttention: 0, },
    工人: { bankBalance: 0,reputation: 100, policeAttention: 0 },
    小偷: { bankBalance: 5000,reputation: 80, policeAttention: 40 },
    黑幫: { bankBalance: 5000,reputation: 80, policeAttention: 50 },
};
function findJobs(job) {

    return jobs[job];
}
module.exports = { findJobs };