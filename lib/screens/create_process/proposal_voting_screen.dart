// file: lib/screens/create_process/proposal_voting_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:ukuvota/widgets/ui/custom_scaffold.dart';
import 'package:ukuvota/widgets/datetime/time_selector.dart';

class ProposalVotingScreen extends StatelessWidget {
  const ProposalVotingScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context)!;

    return CustomScaffold(
      body: Center(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 800),
            child: Column(
              children: [
                const SizedBox(height: 20),
                Text(
                  localizations.setupTimeLeftHeading,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 20),
                TimeSelector(
                  phase: 'proposal',
                  startDate: DateTime.now(),
                  endDate: DateTime.now().add(const Duration(days: 7)),
                  startMinDate: DateTime.now(),
                  onStartDateChanged: (selectedStartDate) {
                    // Handle start date change
                  },
                  onEndDateChanged: (selectedEndDate) {
                    // Handle end date change
                  },
                ),
                const SizedBox(height: 20),
                TimeSelector(
                  phase: 'voting',
                  startDate: DateTime.now().add(const Duration(days: 7)),
                  endDate: DateTime.now().add(const Duration(days: 14)),
                  startMinDate: DateTime.now().add(const Duration(days: 7)),
                  onStartDateChanged: (selectedStartDate) {
                    // Handle start date change
                  },
                  onEndDateChanged: (selectedEndDate) {
                    // Handle end date change
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
