/* TOP LEVEL PAGES ========================================================== */
export const Landing = '/';
export const CreateDAO = '/create';
export const CreateUnityDAO = '/createUnity';
export const NotFound = '/not-found';

/* DAO-SPECIFIC PAGES ======================================================= */

export const Dashboard = '/daos/:network/:dao/dashboard';
export const Finance = '/daos/:network/:dao/finance';
export const Lending = '/daos/:network/:dao/finance/lending';
export const Governance = '/daos/:network/:dao/governance';
export const Community = '/daos/:network/:dao/community';
export const Settings = '/daos/:network/:dao/settings';
export const EditSettings = '/daos/:network/:dao/settings/edit';
export const ProposeNewSettings = '/daos/:network/:dao/settings/new-proposal';

export const AllTokens = '/daos/:network/:dao/finance/tokens';
export const AllTransfers = '/daos/:network/:dao/finance/transfers';
export const NewDeposit = '/daos/:network/:dao/finance/new-deposit';
export const NewWithDraw = '/daos/:network/:dao/finance/new-withdrawal';
export const NewCreditDelegation = '/daos/:network/:dao/finance/credit-delegation';
export const SwapTokens = '/daos/:network/:dao/finance/swap';
export const ProvideLiquidity = '/daos/:network/:dao/finance/provide-liquidity';
export const BudgetAllocation = '/daos/:network/:dao/finance/budget-allocation';

export const Proposal = '/daos/:network/:dao/governance/proposals/:id';
export const NewProposal = '/daos/:network/:dao/governance/new-proposal';
export const MintTokensProposal = '/daos/:network/:dao/community/mint-tokens';
export const ManageMembersProposal =
  '/daos/:network/:dao/community/manage-members';
export const CreateGroupProposal = '/daos/:network/:dao/community/create-group';
