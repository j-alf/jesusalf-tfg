import {MemberBalance} from '../../services/balanceService';

interface BalanceListProps {
    balances: MemberBalance[];
}

export default function BalanceList({balances}: Readonly<BalanceListProps>) {

    const getBalanceTextColor = (netBalance: number): string => {
        if (netBalance > 0) return 'text-green-600';
        if (netBalance < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <div className="space-y-4">
            {balances.map(balance => (
                <div
                    key={balance.memberId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0"
                >
                    <div className="space-y-1 sm:space-y-0">
                        <h3 className="font-medium text-gray-900">{balance.name}</h3>
                        <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:space-x-2">
                            <span>Pagado: {balance.totalPaid.toFixed(2)} €</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Pendiente: {balance.totalOwed.toFixed(2)} €</span>
                        </div>
                    </div>
                    <div
                        className={`text-lg font-semibold ${getBalanceTextColor(balance.netBalance)}`}
                    >
                        {balance.netBalance > 0 ? '+' : ''}
                        {balance.netBalance.toFixed(2)} €
                    </div>
                </div>
            ))}
        </div>
    );
}
