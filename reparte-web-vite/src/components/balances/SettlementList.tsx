import {Settlement} from '../../services/balanceService';
import {v4 as uuid} from 'uuid';
import Button from '../Button';

interface SettlementListProps {
    settlements: Settlement[];
    setAsRefund: (settlement: Settlement) => Promise<void>;
    isSettingRefund?: boolean;
}

export default function SettlementList({settlements, setAsRefund, isSettingRefund}: Readonly<SettlementListProps>) {
    if (settlements.length === 0) {
        return (
            <div className="text-center text-gray-500">
                No hay sugerencias en este momento
            </div>
        );
    }

    const settlementsWithIds = settlements.map(settlement => ({
        ...settlement,
        id: uuid(),
    }));

    return (
        <div className="space-y-4">
            {settlementsWithIds.map((settlement) => (
                <div
                    key={settlement.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-red-600">{settlement.fromMemberName}</span>
                        <span className="text-gray-500">debe a</span>
                        <span className="font-medium text-green-600">{settlement.toMemberName}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="font-semibold text-gray-900">
                            {settlement.amount.toFixed(2)} €
                        </div>
                        <Button
                            onClick={() => setAsRefund(settlement)}
                            disabled={isSettingRefund}
                            variant="primary"
                            className="ml-4"
                        >
                            Liquidar
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}